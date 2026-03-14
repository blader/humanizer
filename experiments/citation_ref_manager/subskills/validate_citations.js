/**
 * Validate Citations Subskill
 * Checks manuscript citations against the CSL-JSON file to ensure all references are properly cited
 */

import {
  verifyManuscriptCitations,
  validateCslJsonSchema,
  validateRequiredFields,
} from '../utils.js';

/**
 * Validates citations in a manuscript against a CSL-JSON reference list
 * @param {string} manuscriptText - The manuscript text to validate
 * @param {Array|Object} cslJson - The CSL-JSON reference list
 * @param {Object} options - Additional options for validation
 * @returns {Object} Validation result with issues and recommendations
 */
export async function validateCitations(manuscriptText, cslJson, options = {}) {
  try {
    // Ensure cslJson is an array
    const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

    // Validate CSL-JSON schema
    const schemaErrors = validateCslJsonSchema(cslArray);
    if (schemaErrors.length > 0) {
      return {
        isValid: false,
        error: 'Invalid CSL-JSON format',
        schemaErrors,
        issues: [],
        missingCitations: [],
        unusedCitations: [],
      };
    }

    // Validate required fields
    const fieldErrors = validateRequiredFields(cslArray);
    if (fieldErrors.length > 0 && options.strictMode) {
      return {
        isValid: false,
        error: 'CSL-JSON has missing required fields',
        fieldErrors,
        issues: [],
        missingCitations: [],
        unusedCitations: [],
      };
    }

    // Find citations in the manuscript
    // Verify citations against the reference list
    const verificationResult = verifyManuscriptCitations(manuscriptText, cslArray);

    // Compile issues
    const issues = [];

    if (verificationResult.missingCitations.length > 0) {
      issues.push({
        type: 'missing_citation',
        severity: 'error',
        message: `Citations referenced in manuscript but not found in reference list: ${verificationResult.missingCitations.join(', ')}`,
        citations: verificationResult.missingCitations,
      });
    }

    if (verificationResult.unusedCitations.length > 0) {
      issues.push({
        type: 'unused_citation',
        severity: 'warning',
        message: `Citations in reference list but not used in manuscript: ${verificationResult.unusedCitations.join(', ')}`,
        citations: verificationResult.unusedCitations,
      });
    }

    // Check for duplicate citations
    const allCitationIds = cslArray.map((c) => c.id);
    const duplicates = allCitationIds.filter((id, index) => allCitationIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate_citation',
        severity: 'warning',
        message: `Duplicate citation IDs found: ${[...new Set(duplicates)].join(', ')}`,
        citations: [...new Set(duplicates)],
      });
    }

    // Check for citations with low information content
    const lowInfoCitations = cslArray
      .filter((citation) => {
        const fields = Object.keys(citation);
        return fields.length < 4; // Less than 4 fields is considered low information
      })
      .map((c) => c.id);

    if (lowInfoCitations.length > 0) {
      issues.push({
        type: 'low_information_citation',
        severity: 'warning',
        message: `Citations with low information content: ${lowInfoCitations.join(', ')}`,
        citations: lowInfoCitations,
      });
    }

    return {
      isValid: verificationResult.isValid && schemaErrors.length === 0,
      issues,
      summary: {
        totalManuscriptCitations: verificationResult.summary.totalManuscriptCitations,
        totalCslCitations: verificationResult.summary.totalCslCitations,
        missingCitations: verificationResult.summary.missingCount,
        unusedCitations: verificationResult.summary.unusedCount,
        duplicateCitations: [...new Set(duplicates)].length,
        lowInfoCitations: lowInfoCitations.length,
        schemaErrors: schemaErrors.length,
        fieldErrors: fieldErrors.length,
      },
      missingCitations: verificationResult.missingCitations,
      unusedCitations: verificationResult.unusedCitations,
      manuscriptCitations: verificationResult.manuscriptCitations,
      cslCitationIds: verificationResult.cslCitationIds,
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      issues: [
        {
          type: 'validation_error',
          severity: 'error',
          message: `Error during citation validation: ${error.message}`,
          error: error,
        },
      ],
      missingCitations: [],
      unusedCitations: [],
      summary: {
        totalManuscriptCitations: 0,
        totalCslCitations: 0,
        missingCitations: 0,
        unusedCitations: 0,
        duplicateCitations: 0,
        lowInfoCitations: 0,
        schemaErrors: 0,
        fieldErrors: 0,
      },
    };
  }
}

/**
 * Validates citations from a file
 * @param {string} manuscriptPath - Path to the manuscript file
 * @param {string} cslJsonPath - Path to the CSL-JSON reference file
 * @param {Object} options - Additional options for validation
 * @returns {Promise<Object>} Validation result
 */
export async function validateCitationsFromFile(manuscriptPath, cslJsonPath, options = {}) {
  try {
    const fs = await import('fs/promises');

    const manuscriptText = await fs.readFile(manuscriptPath, 'utf8');
    const cslJsonContent = await fs.readFile(cslJsonPath, 'utf8');
    const cslJson = JSON.parse(cslJsonContent);

    return await validateCitations(manuscriptText, cslJson, options);
  } catch (error) {
    return {
      isValid: false,
      error: error.message,
      issues: [
        {
          type: 'file_error',
          severity: 'error',
          message: `Error reading files: ${error.message}`,
          error: error,
        },
      ],
    };
  }
}

/**
 * Fixes common citation issues
 * @param {string} manuscriptText - The manuscript text
 * @param {Array|Object} cslJson - The CSL-JSON reference list
 * @param {Object} options - Options for fixing
 * @returns {Object} Fixed manuscript and references with applied fixes
 */
export async function fixCitationIssues(manuscriptText, cslJson, options = {}) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];
  const validationResult = await validateCitations(manuscriptText, cslArray, options);

  const fixedManuscript = manuscriptText;
  let fixedCslJson = [...cslArray];

  // Fix missing citations (if auto-add option is enabled)
  if (options.autoAddMissing && validationResult.missingCitations.length > 0) {
    for (const citationId of validationResult.missingCitations) {
      // Add placeholder citation for missing ones
      const placeholderCitation = {
        id: citationId,
        type: 'article',
        title: `PLACEHOLDER: Missing citation for ${citationId}`,
        note: 'This is a placeholder citation that needs to be properly filled in',
        accessed: {
          'date-parts': [
            [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
          ],
        },
      };

      fixedCslJson.push(placeholderCitation);
    }
  }

  // Remove unused citations (if auto-remove option is enabled)
  if (options.autoRemoveUnused && validationResult.unusedCitations.length > 0) {
    fixedCslJson = fixedCslJson.filter(
      (citation) => !validationResult.unusedCitations.includes(citation.id)
    );
  }

  return {
    manuscript: fixedManuscript,
    cslJson: fixedCslJson,
    appliedFixes: {
      addedCitations: options.autoAddMissing ? validationResult.missingCitations : [],
      removedCitations: options.autoRemoveUnused ? validationResult.unusedCitations : [],
    },
    originalValidation: validationResult,
  };
}

// Export the main function as the default
export default validateCitations;
