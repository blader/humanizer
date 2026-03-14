/**
 * Humanizer Skill Integration Module
 * Integrates the citation reference management system with the humanizer skill framework
 */

import {
  humanizeCitations,
  CanonicalStorage,
  verifyManuscriptCitations,
  enrichCitationWithCrossRef,
  calculateConfidenceScore,
  needsManualVerification,
} from './index.js';

/**
 * Skill adapter for citation verification and management
 * This function integrates with the humanizer skill framework to verify citations
 * @param {string} text - The text to process for citation verification
 * @param {Object} options - Options for processing
 * @returns {Promise<Object>} Result with processed text and citation information
 */
export async function citationVerificationSkill(text, options = {}) {
  try {
    // Extract citations from the text
    const citationIds = findCitationKeysInManuscript(text);

    if (citationIds.length === 0) {
      return {
        text,
        citations: [],
        issues: [],
        message: 'No citations found in the text',
      };
    }

    // Load the canonical reference list
    const storage = new CanonicalStorage(options.referencePath || './canonical-references.json');
    const references = await storage.load();

    // Verify citations in the manuscript
    const verificationResult = verifyManuscriptCitations(text, references);

    // Identify issues
    const issues = [];

    if (verificationResult.missingCitations.length > 0) {
      issues.push({
        type: 'missing_citation',
        message: `Citations referenced in text but not found in reference list: ${verificationResult.missingCitations.join(', ')}`,
        citations: verificationResult.missingCitations,
      });
    }

    if (verificationResult.unusedCitations.length > 0) {
      issues.push({
        type: 'unused_citation',
        message: `Citations in reference list but not used in text: ${verificationResult.unusedCitations.join(', ')}`,
        citations: verificationResult.unusedCitations,
      });
    }

    // Process each citation for quality and confidence
    const citationDetails = [];
    for (const ref of references) {
      if (citationIds.includes(ref.id)) {
        // Calculate confidence score
        const confidence = calculateConfidenceScore(ref);
        const needsVerification = needsManualVerification(confidence);

        citationDetails.push({
          id: ref.id,
          confidence,
          needsVerification,
          title: ref.title || 'Untitled',
          type: ref.type,
        });

        // If confidence is low, suggest enrichment
        if (needsVerification) {
          issues.push({
            type: 'low_confidence_citation',
            message: `Citation "${ref.id}" has low confidence (${confidence.toFixed(2)}). Consider enriching with authoritative source.`,
            citation: ref.id,
            confidence,
          });
        }
      }
    }

    return {
      text,
      citations: citationDetails,
      issues,
      summary: {
        totalCitations: citationIds.length,
        foundCitations: verificationResult.cslCitationIds.length,
        missingCitations: verificationResult.missingCitations.length,
        unusedCitations: verificationResult.unusedCitations.length,
        lowConfidenceCitations: citationDetails.filter((c) => c.needsVerification).length,
      },
    };
  } catch (error) {
    return {
      text,
      citations: [],
      issues: [
        {
          type: 'error',
          message: `Error processing citations: ${error.message}`,
          error: error,
        },
      ],
      error: error.message,
    };
  }
}

/**
 * Skill adapter for citation enrichment
 * This function enriches citations in the text using authoritative sources
 * @param {string} text - The text to process for citation enrichment
 * @param {Object} options - Options for processing
 * @returns {Promise<Object>} Result with enriched citations
 */
export async function citationEnrichmentSkill(text, options = {}) {
  try {
    // Load the canonical reference list
    const storage = new CanonicalStorage(options.referencePath || './canonical-references.json');
    const references = await storage.load();

    const enrichmentResults = [];

    // Process each reference for enrichment
    for (const ref of references) {
      if (options.citationId && ref.id !== options.citationId) {
        continue; // Only process specific citation if specified
      }

      // Try to enrich the citation using CrossRef
      const enrichmentResult = await enrichCitationWithCrossRef(ref);

      if (enrichmentResult.confidence > 0.7) {
        // Update the reference with enriched data
        const updatedRef = {
          ...ref,
          ...enrichmentResult.citation,
        };

        // Save the updated reference
        await storage.addCitation(updatedRef);

        enrichmentResults.push({
          id: ref.id,
          success: true,
          confidence: enrichmentResult.confidence,
          message: `Citation "${ref.id}" enriched with ${enrichmentResult.source} data (confidence: ${enrichmentResult.confidence})`,
        });
      } else {
        enrichmentResults.push({
          id: ref.id,
          success: false,
          confidence: enrichmentResult.confidence,
          message: `Citation "${ref.id}" could not be enriched (confidence: ${enrichmentResult.confidence})`,
        });
      }
    }

    return {
      text,
      enrichmentResults,
      summary: {
        totalCitations: references.length,
        successfullyEnriched: enrichmentResults.filter((r) => r.success).length,
        enrichmentRate:
          ((enrichmentResults.filter((r) => r.success).length / references.length) * 100).toFixed(
            2
          ) + '%',
      },
    };
  } catch (error) {
    return {
      text,
      enrichmentResults: [],
      issues: [
        {
          type: 'error',
          message: `Error enriching citations: ${error.message}`,
          error: error,
        },
      ],
      error: error.message,
    };
  }
}

/**
 * Skill adapter for reference management
 * This function manages the canonical reference list
 * @param {Object} action - The action to perform (add, remove, update, list)
 * @param {Object} options - Options for the action
 * @returns {Promise<Object>} Result of the action
 */
export async function referenceManagementSkill(action, options = {}) {
  try {
    const storage = new CanonicalStorage(options.referencePath || './canonical-references.json');

    switch (action) {
      case 'add':
        if (!options.citation) {
          throw new Error('Citation data is required for add action');
        }
        await storage.addCitation(options.citation);
        return {
          success: true,
          message: `Citation "${options.citation.id}" added to reference list`,
          citation: options.citation,
        };

      case 'list':
        const references = await storage.load();
        return {
          success: true,
          count: references.length,
          citations: references,
        };

      case 'validate':
        const refs = await storage.load();
        const schemaErrors = validateCslJsonSchema(refs);
        const fieldErrors = validateRequiredFields(refs);

        return {
          success: true,
          isValid: schemaErrors.length === 0 && fieldErrors.length === 0,
          schemaErrors,
          fieldErrors,
          summary: {
            totalCitations: refs.length,
            schemaErrors: schemaErrors.length,
            fieldErrors: fieldErrors.length,
          },
        };

      default:
        throw new Error(`Unknown action: ${action}. Supported actions: add, list, validate`);
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      action,
      options,
    };
  }
}

/**
 * Main integration function that ties all citation management features together
 * @param {string} text - The text to process
 * @param {Object} options - Options for processing
 * @returns {Promise<Object>} Comprehensive result with all citation management features
 */
export async function integratedCitationManagement(text, options = {}) {
  // Perform citation verification
  const verificationResult = await citationVerificationSkill(text, options);

  // Perform citation enrichment if requested
  let enrichmentResult = null;
  if (options.autoEnrich) {
    enrichmentResult = await citationEnrichmentSkill(text, options);
  }

  // Perform reference management if requested
  let managementResult = null;
  if (options.manageReferences) {
    managementResult = await referenceManagementSkill(options.action || 'list', options);
  }

  // Compile comprehensive result
  return {
    originalText: text,
    verification: verificationResult,
    enrichment: enrichmentResult,
    management: managementResult,
    summary: {
      totalCitations: verificationResult.summary?.totalCitations || 0,
      missingCitations: verificationResult.summary?.missingCitations || 0,
      lowConfidenceCitations: verificationResult.summary?.lowConfidenceCitations || 0,
      successfullyEnriched: enrichmentResult?.summary?.successfullyEnriched || 0,
      enrichmentRate: enrichmentResult?.summary?.enrichmentRate || '0%',
    },
  };
}

// Export the individual functions for direct use
export {
  humanizeCitations,
  CanonicalStorage,
  verifyManuscriptCitations,
  enrichCitationWithCrossRef,
  calculateConfidenceScore,
  needsManualVerification,
};

// For backward compatibility with the humanizer framework
export default {
  citationVerificationSkill,
  citationEnrichmentSkill,
  referenceManagementSkill,
  integratedCitationManagement,
  // Also include the core functions
  humanizeCitations,
  CanonicalStorage,
  verifyManuscriptCitations,
  enrichCitationWithCrossRef,
  calculateConfidenceScore,
  needsManualVerification,
};
