/**
 * Reference Verifier Subskill
 * Validates URLs, DOIs, and other reference details
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';

/**
 * Verifies URLs and DOIs in CSL-JSON citations
 * @param {Array|Object} cslJson - The CSL-JSON data to verify
 * @param {Object} options - Options for verification
 * @returns {Object} Verification result with status for each citation
 */
export async function referenceVerifier(cslJson, options = {}) {
  try {
    const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

    const results = [];

    for (const citation of cslArray) {
      const citationResult = {
        id: citation.id,
        title: citation.title || 'Untitled',
        urlVerification: null,
        doiVerification: null,
        issues: [],
      };

      // Verify URL if present
      if (citation.URL) {
        citationResult.urlVerification = await verifyUrl(citation.URL, options);
        if (!citationResult.urlVerification.accessible && options.failOnInaccessibleUrls) {
          citationResult.issues.push({
            type: 'inaccessible_url',
            severity: 'error',
            message: `URL is not accessible: ${citation.URL}`,
          });
        }
      }

      // Verify DOI if present
      if (citation.DOI) {
        citationResult.doiVerification = await verifyDoi(citation.DOI, options);
        if (!citationResult.doiVerification.accessible && options.failOnInvalidDois) {
          citationResult.issues.push({
            type: 'invalid_doi',
            severity: 'error',
            message: `DOI is not accessible: ${citation.DOI}`,
          });
        }
      }

      results.push(citationResult);
    }

    // Compile summary
    const summary = {
      totalCitations: cslArray.length,
      citationsWithUrls: results.filter((r) => r.urlVerification).length,
      citationsWithDois: results.filter((r) => r.doiVerification).length,
      accessibleUrls: results.filter((r) => r.urlVerification && r.urlVerification.accessible)
        .length,
      accessibleDois: results.filter((r) => r.doiVerification && r.doiVerification.accessible)
        .length,
      inaccessibleUrls: results.filter((r) => r.urlVerification && !r.urlVerification.accessible)
        .length,
      inaccessibleDois: results.filter((r) => r.doiVerification && !r.doiVerification.accessible)
        .length,
      citationsWithIssues: results.filter((r) => r.issues.length > 0).length,
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
    };

    return {
      results,
      summary,
      isValid:
        options.failOnInaccessibleUrls || options.failOnInvalidDois
          ? summary.inaccessibleUrls === 0 && summary.inaccessibleDois === 0
          : true,
    };
  } catch (error) {
    return {
      results: [],
      summary: {
        totalCitations: 0,
        citationsWithUrls: 0,
        citationsWithDois: 0,
        accessibleUrls: 0,
        accessibleDois: 0,
        inaccessibleUrls: 0,
        inaccessibleDois: 0,
        citationsWithIssues: 0,
        totalIssues: 0,
      },
      isValid: false,
      error: error.message,
    };
  }
}

/**
 * Verifies a single URL
 * @param {string} urlStr - The URL to verify
 * @param {Object} options - Options for verification
 * @returns {Promise<Object>} Verification result
 */
export function verifyUrl(urlStr, options = {}) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const client = url.protocol === 'https:' ? https : http;

      // Set a timeout for the request
      const request = client.request(
        urlStr,
        {
          method: options.method || 'HEAD',
          timeout: options.timeout || 10000,
        },
        (res) => {
          resolve({
            url: urlStr,
            isValid: true,
            statusCode: res.statusCode,
            statusMessage: res.statusMessage,
            accessible: res.statusCode >= 200 && res.statusCode < 400,
            redirected: res.headers.location ? true : false,
            redirectUrl: res.headers.location || null,
            contentType: res.headers['content-type'] || null,
            contentLength: res.headers['content-length']
              ? parseInt(res.headers['content-length'])
              : null,
          });
        }
      );

      request.on('error', (err) => {
        resolve({
          url: urlStr,
          isValid: false,
          error: err.message,
          accessible: false,
        });
      });

      request.on('timeout', () => {
        request.destroy();
        resolve({
          url: urlStr,
          isValid: false,
          error: 'Request timed out',
          accessible: false,
        });
      });

      request.end();
    } catch (error) {
      resolve({
        url: urlStr,
        isValid: false,
        error: error.message,
        accessible: false,
      });
    }
  });
}

/**
 * Verifies a single DOI
 * @param {string} doiStr - The DOI to verify
 * @param {Object} options - Options for verification
 * @returns {Promise<Object>} Verification result
 */
export async function verifyDoi(doiStr, options = {}) {
  // Normalize the DOI - ensure it starts with the resolver URL
  let doiUrl;
  if (doiStr.startsWith('http')) {
    doiUrl = doiStr;
  } else if (doiStr.startsWith('doi:')) {
    doiUrl = 'https://doi.org/' + doiStr.substring(4);
  } else if (doiStr.startsWith('10.')) {
    doiUrl = 'https://doi.org/' + doiStr;
  } else {
    doiUrl = doiStr;
  }

  try {
    const result = await verifyUrl(doiUrl, options);
    return {
      doi: doiStr,
      doiUrl,
      ...result,
    };
  } catch (error) {
    return {
      doi: doiStr,
      doiUrl,
      isValid: false,
      error: error.message,
      accessible: false,
    };
  }
}

/**
 * Verifies references from a file
 * @param {string} cslJsonPath - Path to the CSL-JSON file to verify
 * @param {Object} options - Options for verification
 * @returns {Promise<Object>} Verification result
 */
export async function verifyReferencesFromFile(cslJsonPath, options = {}) {
  try {
    const fs = await import('fs/promises');

    const cslJsonContent = await fs.readFile(cslJsonPath, 'utf8');
    const cslJson = JSON.parse(cslJsonContent);

    return await referenceVerifier(cslJson, options);
  } catch (error) {
    return {
      results: [],
      summary: {
        totalCitations: 0,
        citationsWithUrls: 0,
        citationsWithDois: 0,
        accessibleUrls: 0,
        accessibleDois: 0,
        inaccessibleUrls: 0,
        inaccessibleDois: 0,
        citationsWithIssues: 0,
        totalIssues: 0,
      },
      isValid: false,
      error: error.message,
    };
  }
}

/**
 * Filters citations by verification status
 * @param {Array|Object} cslJson - The CSL-JSON data
 * @param {Object} filters - Filters to apply
 * @returns {Array} Filtered citations
 */
export async function filterCitationsByVerificationStatus(cslJson, filters = {}) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  // First verify the citations
  const verificationResult = await referenceVerifier(cslArray);

  // Create a map of verification results by citation ID
  const verificationMap = {};
  for (const result of verificationResult.results) {
    verificationMap[result.id] = result;
  }

  // Filter the original citations based on verification status
  return cslArray.filter((citation) => {
    const verification = verificationMap[citation.id];

    if (!verification) return false;

    // Apply filters
    if (
      filters.requireAccessibleUrl &&
      (!verification.urlVerification || !verification.urlVerification.accessible)
    ) {
      return false;
    }

    if (
      filters.requireAccessibleDoi &&
      (!verification.doiVerification || !verification.doiVerification.accessible)
    ) {
      return false;
    }

    if (filters.hasIssues && verification.issues.length === 0) {
      return false;
    }

    if (filters.noIssues && verification.issues.length > 0) {
      return false;
    }

    return true;
  });
}

/**
 * Gets a list of invalid references
 * @param {Array|Object} cslJson - The CSL-JSON data
 * @param {Object} options - Options for verification
 * @returns {Promise<Array>} List of invalid references
 */
export async function getInvalidReferences(cslJson, options = {}) {
  const verificationResult = await referenceVerifier(cslJson, options);

  const invalidRefs = [];

  for (const result of verificationResult.results) {
    if (
      (result.urlVerification && !result.urlVerification.accessible) ||
      (result.doiVerification && !result.doiVerification.accessible)
    ) {
      invalidRefs.push({
        id: result.id,
        title: result.title,
        url: result.urlVerification ? result.urlVerification.url : null,
        doi: result.doiVerification ? result.doiVerification.doi : null,
        urlAccessible: result.urlVerification ? result.urlVerification.accessible : null,
        doiAccessible: result.doiVerification ? result.doiVerification.accessible : null,
        issues: result.issues,
      });
    }
  }

  return invalidRefs;
}

/**
 * Creates a report of verification results
 * @param {Array|Object} cslJson - The CSL-JSON data
 * @param {Object} options - Options for verification
 * @returns {Promise<Object>} Verification report
 */
export async function createVerificationReport(cslJson, options = {}) {
  const verificationResult = await referenceVerifier(cslJson, options);

  const report = {
    generatedAt: new Date().toISOString(),
    options,
    summary: verificationResult.summary,
    details: verificationResult.results.map((result) => ({
      id: result.id,
      title: result.title,
      url: result.urlVerification ? result.urlVerification.url : null,
      urlAccessible: result.urlVerification ? result.urlVerification.accessible : null,
      doi: result.doiVerification ? result.doiVerification.doi : null,
      doiAccessible: result.doiVerification ? result.doiVerification.accessible : null,
      issues: result.issues,
    })),
    recommendations: [],
  };

  // Add recommendations based on the results
  if (report.summary.inaccessibleUrls > 0) {
    report.recommendations.push(
      `Check and update ${report.summary.inaccessibleUrls} inaccessible URLs`
    );
  }

  if (report.summary.inaccessibleDois > 0) {
    report.recommendations.push(
      `Verify and correct ${report.summary.inaccessibleDois} invalid DOIs`
    );
  }

  if (report.summary.citationsWithIssues > 0) {
    report.recommendations.push(
      `Review ${report.summary.citationsWithIssues} citations with verification issues`
    );
  }

  return report;
}

// Export the main function as the default
export default referenceVerifier;
