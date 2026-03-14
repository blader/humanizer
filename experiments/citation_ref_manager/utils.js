/**
 * Citation Reference Manager - Utilities
 * Contains utility classes and functions for the citation reference management system
 */

import https from 'https';
import fs from 'fs/promises';

/**
 * Manages the canonical CSL-JSON file
 */
export class CanonicalStorage {
  constructor(storagePath = './canonical-references.json') {
    this.storagePath = storagePath;
  }

  /**
   * Loads the canonical CSL-JSON file
   * @returns {Promise<Object>} The loaded CSL-JSON object
   */
  async load() {
    try {
      const content = await fs.readFile(this.storagePath, 'utf8');
      const cslJson = JSON.parse(content);

      // Validate CSL-JSON schema
      const errors = validateCslJsonSchema(cslJson);
      if (errors.length > 0) {
        throw new Error(`Invalid CSL-JSON in ${this.storagePath}: ${errors.join('; ')}`);
      }

      return cslJson;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Saves the CSL-JSON to the canonical file
   * @param {Object} cslJson - The CSL-JSON object to save
   * @returns {Promise<void>}
   */
  async save(cslJson) {
    const errors = validateCslJsonSchema(cslJson);
    if (errors.length > 0) {
      throw new Error(`Cannot save invalid CSL-JSON: ${errors.join('; ')}`);
    }

    const dir = (await import('path')).default.dirname(this.storagePath);
    await fs.mkdir(dir, { recursive: true });

    const jsonString = JSON.stringify(cslJson, null, 2);
    await fs.writeFile(this.storagePath, jsonString, 'utf8');
  }

  /**
   * Adds a new citation to the canonical storage
   * @param {Object} citation - The citation to add
   * @returns {Promise<void>}
   */
  async addCitation(citation) {
    const cslJson = await this.load();

    const existingIndex = cslJson.findIndex((c) => c.id === citation.id);
    if (existingIndex !== -1) {
      cslJson[existingIndex] = { ...cslJson[existingIndex], ...citation };
    } else {
      cslJson.push(citation);
    }

    await this.save(cslJson);
  }
}

/**
 * Validates CSL-JSON schema against the official schema
 * @param {Object} cslJson - The CSL-JSON object to validate
 * @returns {Array} Array of validation errors, empty if valid
 */
export function validateCslJsonSchema(cslJson) {
  const errors = [];

  if (!Array.isArray(cslJson)) {
    errors.push('CSL-JSON must be an array of citation objects');
    return errors;
  }

  for (let i = 0; i < cslJson.length; i++) {
    const citation = cslJson[i];

    if (!citation.id) {
      errors.push(`Citation at index ${i} is missing required 'id' field`);
    }

    if (!citation.type) {
      errors.push(`Citation at index ${i} is missing required 'type' field`);
    } else {
      const validTypes = [
        'article',
        'article-journal',
        'article-magazine',
        'article-newspaper',
        'bill',
        'book',
        'broadcast',
        'chapter',
        'dataset',
        'entry',
        'entry-dictionary',
        'entry-encyclopedia',
        'figure',
        'graphic',
        'interview',
        'legal_case',
        'legislation',
        'manuscript',
        'map',
        'motion_picture',
        'musical_score',
        'pamphlet',
        'paper-conference',
        'patent',
        'personal_communication',
        'post',
        'post-weblog',
        'report',
        'review',
        'review-book',
        'song',
        'speech',
        'thesis',
        'treaty',
        'webpage',
      ];

      if (!validTypes.includes(citation.type)) {
        errors.push(
          `Citation at index ${i} has invalid type '${citation.type}'. Valid types are: ${validTypes.join(', ')}`
        );
      }
    }
  }

  return errors;
}

/**
 * Validates that all fields required for downstream use are present
 * @param {Object} cslJson - The CSL-JSON object to validate
 * @returns {Array} Array of validation errors, empty if valid
 */
export function validateRequiredFields(cslJson) {
  const errors = [];

  if (!Array.isArray(cslJson)) {
    errors.push('CSL-JSON must be an array of citation objects');
    return errors;
  }

  for (let i = 0; i < cslJson.length; i++) {
    const citation = cslJson[i];

    switch (citation.type) {
      case 'book':
        if (!citation.author && !citation.editor && !citation.title) {
          errors.push(
            `Book citation at index ${i} is missing essential fields (author, editor, or title)`
          );
        }
        break;

      case 'article-journal':
        if (!citation.author && !citation.title) {
          errors.push(
            `Journal article citation at index ${i} is missing essential fields (author or title)`
          );
        }
        break;

      case 'webpage':
        if (!citation.title && !citation.URL) {
          errors.push(`Webpage citation at index ${i} is missing essential fields (title or URL)`);
        }
        break;

      default:
        if (!citation.title) {
          errors.push(`Citation at index ${i} of type '${citation.type}' is missing title`);
        }
    }
  }

  return errors;
}

/**
 * Finds all citation keys in a manuscript text
 * @param {string} manuscriptText - The manuscript text to scan
 * @returns {Array<string>} Array of citation keys found in the text
 */
export function findCitationKeysInManuscript(manuscriptText) {
  if (typeof manuscriptText !== 'string') {
    throw new Error('Manuscript text must be a string');
  }

  // Regular expression to match citation patterns like [item1], [item2], etc.
  // This looks for bracketed identifiers that are likely citation IDs
  const citationRegex = /\[([a-zA-Z0-9._-]+)\]/g;
  const matches = [...manuscriptText.matchAll(citationRegex)];

  // Extract just the keys from the capture group
  const keys = matches.map((match) => match[1]);

  // Return unique keys
  return [...new Set(keys)];
}

/**
 * Calculates a confidence score for a citation based on various factors
 * @param {Object} citation - The CSL-JSON citation to evaluate
 * @param {Object} originalCitation - The original citation for comparison
 * @returns {number} Confidence score between 0 and 1
 */
export function calculateConfidenceScore(citation, originalCitation = {}) {
  let score = 0.5; // Base score

  // Factor 1: Completeness of required fields
  const requiredFields = ['title', 'author', 'type'];
  const presentRequiredFields = requiredFields.filter((field) => citation[field]).length;
  const completenessFactor = presentRequiredFields / requiredFields.length;
  score += completenessFactor * 0.2; // Up to 0.2 points for completeness

  // Factor 2: Presence of authoritative identifiers
  if (citation.DOI) score += 0.15; // DOI is a strong indicator
  if (citation.ISBN) score += 0.1; // ISBN is also good
  if (citation.PMID) score += 0.05; // PMID adds some confidence

  // Factor 3: Quality of author information
  if (citation.author && Array.isArray(citation.author) && citation.author.length > 0) {
    const authorsWithNames = citation.author.filter(
      (author) => author.family || author.given || author.literal
    ).length;
    score += (authorsWithNames / citation.author.length) * 0.1; // Up to 0.1 for author quality
  }

  // Factor 4: Publication date reliability
  if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
    const year = citation.issued['date-parts'][0][0];
    const currentYear = new Date().getFullYear();

    // Check if the year is reasonable (not too far in the future or too far in the past)
    if (year <= currentYear && year >= 1800) {
      score += 0.05;
    }
  }

  // Factor 5: URL/DOI validity
  if (citation.URL) {
    // Check if URL looks valid
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (urlRegex.test(citation.URL)) {
      score += 0.05;
    }
  }

  // Factor 6: Compare with original citation to see if information was added
  if (originalCitation) {
    const fieldsAdded = Object.keys(citation).filter(
      (key) => citation[key] && !originalCitation[key]
    ).length;

    if (fieldsAdded > 0) {
      // If new fields were added during enrichment, check their quality
      score += Math.min(fieldsAdded * 0.02, 0.1); // Max 0.1 for new fields
    }
  }

  // Ensure score is between 0 and 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Determines if a citation needs manual verification based on confidence score
 * @param {number} confidenceScore - The confidence score (0-1)
 * @param {number} threshold - The threshold below which manual verification is needed (default: 0.7)
 * @returns {boolean} True if manual verification is needed
 */
export function needsManualVerification(confidenceScore, threshold = 0.7) {
  return confidenceScore < threshold;
}

/**
 * Verifies that all citations in the manuscript have corresponding entries in the CSL-JSON
 * @param {string} manuscriptText - The manuscript text
 * @param {Array} cslJson - The CSL-JSON array of citations
 * @returns {Object} Verification result with missing citations and other info
 */
export function verifyManuscriptCitations(manuscriptText, cslJson) {
  if (!Array.isArray(cslJson)) {
    throw new Error('CSL-JSON must be an array of citation objects');
  }

  const manuscriptCitations = findCitationKeysInManuscript(manuscriptText);
  const cslCitationIds = cslJson.map((citation) => citation.id);

  const missingCitations = manuscriptCitations.filter((key) => !cslCitationIds.includes(key));

  const unusedCitations = cslCitationIds.filter((id) => !manuscriptCitations.includes(id));

  return {
    manuscriptCitations,
    cslCitationIds,
    missingCitations,
    unusedCitations,
    isValid: missingCitations.length === 0,
    summary: {
      totalManuscriptCitations: manuscriptCitations.length,
      totalCslCitations: cslCitationIds.length,
      missingCount: missingCitations.length,
      unusedCount: unusedCitations.length,
    },
  };
}

/**
 * Main function to humanize citations in text by ensuring they're properly sourced
 * @param {string} text - The text to humanize
 * @param {Object} options - Options for the humanization process
 * @returns {Promise<string>} The humanized text
 */
export async function humanizeCitations(text, options = {}) {
  // Extract citations from the text
  const citationIds = findCitationKeysInManuscript(text);

  if (citationIds.length === 0) {
    // No citations found, return original text
    return text;
  }

  // Load the canonical reference list
  const storage = new CanonicalStorage(options.referencePath || './canonical-references.json');
  const references = await storage.load();

  // Check which citations are properly sourced
  const unsourcedCitations = citationIds.filter((id) => !references.some((ref) => ref.id === id));

  if (unsourcedCitations.length > 0 && options.enrichUnsourced !== false) {
    // Attempt to enrich unsourced citations using external APIs
    for (const id of unsourcedCitations) {
      // This is a simplified approach - in a real implementation, we would
      // have more sophisticated methods to find and verify citations

      // For now, we'll just add a note about the unsourced citation
      console.warn(`Unsourced citation detected: ${id}`);
    }
  }

  // Return the original text for now
  // In a more advanced implementation, we might modify the text
  // to indicate which citations are verified vs. unverified
  return text;
}

/**
 * Enriches a CSL-JSON citation using CrossRef
 * @param {Object} citation - The CSL-JSON citation to enrich
 * @returns {Promise<Object>} The enriched CSL-JSON citation with confidence score
 */
export async function enrichCitationWithCrossRef(citation) {
  try {
    let enrichedCitation = { ...citation };
    let confidence = 0.3; // Base confidence

    // Try to find the citation using DOI if available
    if (citation.DOI) {
      try {
        const crossRefData = await searchCrossRefByDoi(citation.DOI);
        const convertedData = convertCrossRefToCslJson(crossRefData);

        // Merge the data, preferring existing fields in the original citation
        enrichedCitation = {
          ...convertedData,
          ...citation, // Original citation takes precedence for overlapping fields
        };

        confidence = 0.9; // Very high confidence when using DOI
      } catch (error) {
        console.warn(`Could not enrich citation ${citation.id} using DOI: ${error.message}`);
      }
    }

    return {
      citation: enrichedCitation,
      confidence,
      source: 'CrossRef',
    };
  } catch (error) {
    return {
      citation,
      confidence: 0.1,
      source: 'CrossRef',
      error: error.message,
    };
  }
}

/**
 * Searches CrossRef for a given DOI
 * @param {string} doi - The DOI to search for
 * @returns {Promise<Object>} The CrossRef metadata for the DOI
 */
async function searchCrossRefByDoi(doi) {
  return new Promise((resolve, reject) => {
    const encodedDoi = encodeURIComponent(doi);
    const url = `https://api.crossref.org/works/${encodedDoi}`;

    https
      .get(url, { headers: { Accept: 'application/json' } }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status === 'ok' && response.message) {
              resolve(response.message);
            } else {
              reject(new Error(`CrossRef API error: ${response.status || 'Unknown error'}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse CrossRef response: ${error.message}`));
          }
        });
      })
      .on('error', (error) => {
        reject(new Error(`CrossRef API request failed: ${error.message}`));
      });
  });
}

/**
 * Converts CrossRef metadata to CSL-JSON format
 * @param {Object} crossRefItem - The CrossRef metadata item
 * @returns {Object} The CSL-JSON representation
 */
function convertCrossRefToCslJson(crossRefItem) {
  if (!crossRefItem) {
    return null;
  }

  const cslJson = {};

  // Set the ID (prefer DOI, otherwise generate one)
  cslJson.id = crossRefItem.DOI || `crossref-${Date.now()}`;

  // Set the type based on CrossRef type
  cslJson.type = mapCrossRefTypeToCsl(crossRefItem.type) || 'article';

  // Set the title
  if (crossRefItem.title && crossRefItem.title[0]) {
    cslJson.title = crossRefItem.title[0];
  }

  // Set the author
  if (crossRefItem.author) {
    cslJson.author = crossRefItem.author.map((author) => {
      const cslAuthor = {};
      if (author.family) cslAuthor.family = author.family;
      if (author.given) cslAuthor.given = author.given;
      if (author.literal) cslAuthor.literal = author.literal;
      return cslAuthor;
    });
  }

  // Set the container title (e.g., journal name)
  if (crossRefItem['container-title'] && crossRefItem['container-title'][0]) {
    cslJson['container-title'] = crossRefItem['container-title'][0];
  }

  // Set the publisher
  if (crossRefItem.publisher) {
    cslJson.publisher = crossRefItem.publisher;
  }

  // Set the issued date
  if (
    crossRefItem.issued &&
    crossRefItem.issued['date-parts'] &&
    crossRefItem.issued['date-parts'][0]
  ) {
    cslJson.issued = { 'date-parts': [crossRefItem.issued['date-parts'][0]] };
  }

  // Set the URL
  if (crossRefItem.URL) {
    cslJson.URL = crossRefItem.URL;
  }

  // Set the DOI
  if (crossRefItem.DOI) {
    cslJson.DOI = crossRefItem.DOI;
  }

  // Set volume and issue if available
  if (crossRefItem.volume) {
    cslJson.volume = crossRefItem.volume;
  }

  if (crossRefItem.issue) {
    cslJson.issue = crossRefItem.issue;
  }

  // Set page information
  if (crossRefItem.page) {
    cslJson.page = crossRefItem.page;
  }

  return cslJson;
}

/**
 * Maps CrossRef types to CSL types
 * @param {string} crossRefType - The CrossRef type
 * @returns {string} The corresponding CSL type
 */
function mapCrossRefTypeToCsl(crossRefType) {
  const typeMap = {
    'journal-article': 'article-journal',
    'book-chapter': 'chapter',
    book: 'book',
    monograph: 'book',
    'edited-book': 'book',
    'reference-book': 'book',
    'book-series': 'book',
    'book-set': 'book',
    dissertation: 'thesis',
    report: 'report',
    standard: 'report',
    'reference-entry': 'entry',
    dataset: 'dataset',
    'posted-content': 'article',
    'proceedings-article': 'paper-conference',
    'conference-paper': 'paper-conference',
    proceedings: 'book',
    'peer-review': 'review',
    component: 'article',
    'book-track': 'chapter',
    'journal-volume': 'article-journal',
    journal: 'article-journal',
    element: 'article',
    article: 'article',
    'journal-issue': 'article-journal',
    'proceedings-series': 'book',
    'book-part': 'chapter',
    other: 'article',
    'output-management-plan': 'report',
  };

  return typeMap[crossRefType] || 'article';
}

/**
 * Converts CSL-JSON to RIS format
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @returns {string} The RIS representation
 */
export function cslJsonToRis(cslJson) {
  // Ensure we're working with an array
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  let risOutput = '';

  for (const citation of cslArray) {
    // Determine the RIS type based on CSL type
    const risType = mapCslTypeToRis(citation.type);
    risOutput += `TY  - ${risType}\n`;

    // Add title
    if (citation.title) {
      risOutput += `TI  - ${citation.title}\n`;
    }

    // Add primary title (for book chapters, etc.)
    if (citation['container-title']) {
      risOutput += `T2  - ${citation['container-title']}\n`;
    }

    // Add authors
    if (citation.author && Array.isArray(citation.author)) {
      for (const author of citation.author) {
        let authorName = '';
        if (author.family) {
          authorName = author.family;
          if (author.given) {
            authorName += ', ' + author.given;
          }
        } else if (author.literal) {
          authorName = author.literal;
        }

        if (authorName) {
          risOutput += `AU  - ${authorName}\n`;
        }
      }
    }

    // Add editor if no author
    if (!citation.author && citation.editor && Array.isArray(citation.editor)) {
      for (const editor of citation.editor) {
        let editorName = '';
        if (editor.family) {
          editorName = editor.family;
          if (editor.given) {
            editorName += ', ' + editor.given;
          }
        } else if (editor.literal) {
          editorName = editor.literal;
        }

        if (editorName) {
          risOutput += `ED  - ${editorName}\n`;
        }
      }
    }

    // Add publication details
    if (citation.publisher) {
      risOutput += `PB  - ${citation.publisher}\n`;
    }

    if (citation['publisher-place']) {
      risOutput += `PP  - ${citation['publisher-place']}\n`;
    }

    // Add date
    if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
      const dateParts = citation.issued['date-parts'][0];
      risOutput += `PY  - ${dateParts.join('/')}\n`;
    }

    // Add volume and issue
    if (citation.volume) {
      risOutput += `VL  - ${citation.volume}\n`;
    }

    if (citation.issue) {
      risOutput += `IS  - ${citation.issue}\n`;
    }

    // Add pages
    if (citation.page) {
      risOutput += `SP  - ${citation.page.split('-')[0] || citation.page}\n`; // Start page
      if (citation.page.includes('-')) {
        risOutput += `EP  - ${citation.page.split('-')[1]}\n`; // End page
      }
    }

    // Add DOI
    if (citation.DOI) {
      risOutput += `DO  - ${citation.DOI}\n`;
    }

    // Add URL
    if (citation.URL) {
      risOutput += `UR  - ${citation.URL}\n`;
    }

    // Add number of pages (if available)
    if (citation['number-of-pages']) {
      risOutput += `EP  - ${citation['number-of-pages']}\n`;
    }

    // End each reference with ER
    risOutput += 'ER  - \n\n';
  }

  return risOutput.trim();
}

/**
 * Maps CSL types to RIS types
 * @param {string} cslType - The CSL type
 * @returns {string} The corresponding RIS type
 */
function mapCslTypeToRis(cslType) {
  const typeMap = {
    'article-journal': 'JOUR',
    'article-magazine': 'MGZN',
    'article-newspaper': 'NEWS',
    book: 'BOOK',
    chapter: 'CHAP',
    dataset: 'DATA',
    thesis: 'THES',
    manuscript: 'MANU',
    'paper-conference': 'CONF',
    report: 'RPRT',
    webpage: 'ELEC',
    bill: 'BILL',
    legal_case: 'CASE',
    hearing: 'HEAR',
    patent: 'PAT',
    statute: 'STAT',
    email: 'ICOM',
    interview: 'ICOM',
    motion_picture: 'MPCT',
    song: 'SOUND',
    speech: 'SOUND',
    personal_communication: 'PCOMM',
  };

  return typeMap[cslType] || 'GEN';
}

/**
 * Converts CSL-JSON to YAML format
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @returns {string} The YAML representation
 */
export function cslJsonToYaml(cslJson) {
  // Ensure we're working with an array
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  let yamlOutput = '';

  for (const citation of cslArray) {
    // Use the ID as the key for the entry
    yamlOutput += `- id: ${citation.id}\n`;

    // Add type
    if (citation.type) {
      yamlOutput += `  type: ${citation.type}\n`;
    }

    // Add title
    if (citation.title) {
      yamlOutput += `  title: ${escapeYamlValue(citation.title)}\n`;
    }

    // Add author
    if (citation.author && Array.isArray(citation.author) && citation.author.length > 0) {
      yamlOutput += '  author:\n';
      for (const author of citation.author) {
        yamlOutput += '    - ';
        if (author.family) {
          yamlOutput += `family: ${escapeYamlValue(author.family)}\n`;
        }
        if (author.given) {
          yamlOutput += `      given: ${escapeYamlValue(author.given)}\n`;
        }
        if (author.literal) {
          yamlOutput += `      literal: ${escapeYamlValue(author.literal)}\n`;
        }
        yamlOutput += '\n'; // Add extra newline for readability
      }
    }

    // Add container title (e.g., journal name)
    if (citation['container-title']) {
      yamlOutput += `  container-title: ${escapeYamlValue(citation['container-title'])}\n`;
    }

    // Add publisher
    if (citation.publisher) {
      yamlOutput += `  publisher: ${escapeYamlValue(citation.publisher)}\n`;
    }

    // Add issued date
    if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
      const dateParts = citation.issued['date-parts'][0];
      yamlOutput += '  issued:\n';
      yamlOutput += '    date-parts:\n';
      yamlOutput += `      - [${dateParts.join(', ')}]\n`;
    }

    // Add URL
    if (citation.URL) {
      yamlOutput += `  URL: ${escapeYamlValue(citation.URL)}\n`;
    }

    // Add DOI
    if (citation.DOI) {
      yamlOutput += `  DOI: ${escapeYamlValue(citation.DOI)}\n`;
    }

    // Add volume
    if (citation.volume) {
      yamlOutput += `  volume: ${citation.volume}\n`;
    }

    // Add issue
    if (citation.issue) {
      yamlOutput += `  issue: ${citation.issue}\n`;
    }

    // Add page
    if (citation.page) {
      yamlOutput += `  page: ${escapeYamlValue(citation.page)}\n`;
    }

    // Add other fields as needed
    for (const [key, value] of Object.entries(citation)) {
      if (
        ![
          'id',
          'type',
          'title',
          'author',
          'container-title',
          'publisher',
          'issued',
          'URL',
          'DOI',
          'volume',
          'issue',
          'page',
        ].includes(key)
      ) {
        yamlOutput += `  ${key}: ${escapeYamlValue(value)}\n`;
      }
    }

    yamlOutput += '\n'; // Separate entries with a blank line
  }

  return yamlOutput.trim();
}

/**
 * Escapes a value for safe use in YAML
 * @param {any} value - The value to escape
 * @returns {string} The escaped value
 */
function escapeYamlValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'string') {
    // If the string contains special characters, wrap it in quotes
    if (
      value.includes('\n') ||
      value.includes('"') ||
      value.includes("'") ||
      value.includes(': ') ||
      value.includes('#') ||
      value.includes('[') ||
      value.includes(']') ||
      value.includes('{') ||
      value.includes('}') ||
      value.includes('|') ||
      value.includes('>')
    ) {
      // Escape double quotes and wrap in double quotes
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}
