/**
 * Enrich References Subskill
 * Connects to databases to enhance reference information
 */

import { calculateConfidenceScore, needsManualVerification } from '../utils.js';

/**
 * Enriches a CSL-JSON reference list using external databases
 * @param {Array|Object} cslJson - The CSL-JSON reference list to enrich
 * @param {Object} options - Options for enrichment
 * @returns {Object} Enrichment result with updated references and confidence scores
 */
export async function enrichReferences(cslJson, options = {}) {
  try {
    const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

    const results = [];
    const enrichedCslJson = [];

    for (const citation of cslArray) {
      // Skip if already enriched recently (if cache option is enabled)
      if (options.useCache && citation._enrichedAt) {
        const daysSinceEnrichment =
          (Date.now() - new Date(citation._enrichedAt).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceEnrichment < (options.cacheDays || 30)) {
          enrichedCslJson.push(citation);
          results.push({
            id: citation.id,
            success: true,
            message: 'Using cached version',
            confidence: calculateConfidenceScore(citation),
            source: 'cache',
          });
          continue;
        }
      }

      // Determine which enrichment sources to use
      const sources = options.sources || ['crossref'];

      let enrichedCitation = { ...citation };
      let bestConfidence = calculateConfidenceScore(citation);
      let bestSource = 'original';

      // Try CrossRef enrichment
      if (sources.includes('crossref') && citation.DOI) {
        try {
          const crossRefResult = await enrichCitationWithCrossRef(citation);
          if (crossRefResult.confidence > bestConfidence) {
            enrichedCitation = crossRefResult.citation;
            bestConfidence = crossRefResult.confidence;
            bestSource = crossRefResult.source;
          }
        } catch (error) {
          console.warn(`CrossRef enrichment failed for ${citation.id}: ${error.message}`);
        }
      }

      // Add enrichment metadata
      enrichedCitation._enrichedAt = new Date().toISOString();
      enrichedCitation._enrichedBy = bestSource;
      enrichedCitation._confidence = bestConfidence;
      enrichedCitation._needsVerification = needsManualVerification(
        bestConfidence,
        options.verificationThreshold || 0.7
      );

      enrichedCslJson.push(enrichedCitation);

      results.push({
        id: citation.id,
        success: true,
        message: `Enriched using ${bestSource} (confidence: ${bestConfidence.toFixed(2)})`,
        confidence: bestConfidence,
        source: bestSource,
        needsVerification: needsManualVerification(
          bestConfidence,
          options.verificationThreshold || 0.7
        ),
      });
    }

    return {
      enrichedCslJson,
      results,
      summary: {
        totalCitations: cslArray.length,
        successfullyEnriched: results.filter((r) => r.success).length,
        lowConfidenceCitations: results.filter((r) => r.needsVerification).length,
        enrichmentRate:
          ((results.filter((r) => r.success).length / cslArray.length) * 100).toFixed(2) + '%',
      },
    };
  } catch (error) {
    return {
      enrichedCslJson: [],
      results: [],
      error: error.message,
      summary: {
        totalCitations: 0,
        successfullyEnriched: 0,
        lowConfidenceCitations: 0,
        enrichmentRate: '0%',
      },
    };
  }
}

/**
 * Enriches references from a file
 * @param {string} cslJsonPath - Path to the CSL-JSON file to enrich
 * @param {Object} options - Options for enrichment
 * @returns {Promise<Object>} Enrichment result
 */
export async function enrichReferencesFromFile(cslJsonPath, options = {}) {
  try {
    const fs = await import('fs/promises');

    const cslJsonContent = await fs.readFile(cslJsonPath, 'utf8');
    const cslJson = JSON.parse(cslJsonContent);

    const result = await enrichReferences(cslJson, options);

    // Optionally save the enriched version
    if (options.saveResult) {
      const outputPath = options.outputPath || cslJsonPath.replace('.json', '_enriched.json');
      await fs.writeFile(outputPath, JSON.stringify(result.enrichedCslJson, null, 2), 'utf8');
    }

    return result;
  } catch (error) {
    return {
      enrichedCslJson: [],
      results: [],
      error: error.message,
      summary: {
        totalCitations: 0,
        successfullyEnriched: 0,
        lowConfidenceCitations: 0,
        enrichmentRate: '0%',
      },
    };
  }
}

/**
 * Gets enrichment recommendations for low-confidence citations
 * @param {Array|Object} cslJson - The CSL-JSON reference list
 * @param {Object} options - Options for getting recommendations
 * @returns {Array} Recommendations for citations that need manual verification
 */
export async function getEnrichmentRecommendations(cslJson, options = {}) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  const recommendations = [];

  for (const citation of cslArray) {
    const confidence = citation._confidence || calculateConfidenceScore(citation);
    const needsVerification =
      citation._needsVerification ||
      needsManualVerification(confidence, options.verificationThreshold || 0.7);

    if (needsVerification) {
      recommendations.push({
        id: citation.id,
        title: citation.title || 'Untitled',
        confidence,
        needsVerification,
        issues: getConfidenceIssues(citation),
        recommendation: `Manually verify citation "${citation.id}" - ${citation.title || 'Untitled'} (confidence: ${confidence.toFixed(2)})`,
      });
    }
  }

  return recommendations;
}

/**
 * Identifies issues that might be affecting confidence score
 * @param {Object} citation - The citation to analyze
 * @returns {Array} Array of potential issues
 */
function getConfidenceIssues(citation) {
  const issues = [];

  if (!citation.title) {
    issues.push('Missing title');
  }

  if (!citation.author || citation.author.length === 0) {
    issues.push('No authors listed');
  }

  if (!citation.issued || !citation.issued['date-parts']) {
    issues.push('Missing publication date');
  }

  if (!citation.DOI && !citation.ISBN && !citation.PMID) {
    issues.push('Missing authoritative identifier (DOI, ISBN, PMID)');
  }

  if (!citation.URL) {
    issues.push('Missing URL for verification');
  }

  return issues;
}

/**
 * Filters citations by confidence score
 * @param {Array|Object} cslJson - The CSL-JSON reference list
 * @param {number} minConfidence - Minimum confidence score (0-1)
 * @param {number} maxConfidence - Maximum confidence score (0-1)
 * @returns {Array} Filtered citations
 */
export function filterCitationsByConfidence(cslJson, minConfidence = 0, maxConfidence = 1) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  return cslArray.filter((citation) => {
    const confidence = citation._confidence || calculateConfidenceScore(citation);
    return confidence >= minConfidence && confidence <= maxConfidence;
  });
}

// Export the main function as the default
export default enrichReferences;
