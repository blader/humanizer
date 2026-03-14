/**
 * Format Converter Subskill
 * Handles conversion between different citation formats
 */

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

/**
 * Converts CSL-JSON to various formats
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @param {string} format - The target format ('yaml', 'ris', 'biblatex', 'endnote-xml', 'enw')
 * @param {Object} options - Additional options for conversion
 * @returns {string|Object} Converted content in the specified format
 */
export function formatConverter(cslJson, format, options = {}) {
  try {
    const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

    let convertedContent = '';
    const shouldValidate = options.validate === true;
    let validation = null;

    switch (format.toLowerCase()) {
      case 'yaml':
      case 'yml':
        convertedContent = cslJsonToYaml(cslArray);
        break;

      case 'ris':
        convertedContent = cslJsonToRis(cslArray);
        break;

      case 'biblatex':
      case 'bibtex':
        convertedContent = cslJsonToBiblatex(cslArray);
        break;

      case 'endnote-xml':
      case 'endnote xml':
        convertedContent = convertCslToJsonToEndnoteXml(cslArray);
        if (shouldValidate) {
          validation = validateEndnoteXml(convertedContent);
        }
        break;

      case 'enw':
      case 'endnote-tagged':
        convertedContent = convertCslToJsonToEndnoteTagged(cslArray);
        if (shouldValidate) {
          validation = validateEnw(convertedContent);
        }
        break;

      default:
        throw new Error(
          `Unsupported format: ${format}. Supported formats: yaml, ris, biblatex, bibtex, endnote-xml, enw`
        );
    }

    return {
      format: format.toLowerCase(),
      content: convertedContent,
      validation,
      isValid: validation?.isValid ?? true,
      warnings: validation?.warnings ?? [],
      errors: validation?.errors ?? [],
    };
  } catch (error) {
    return {
      format: format.toLowerCase(),
      content: null,
      validation: null,
      isValid: false,
      errors: [error.message],
      warnings: [],
    };
  }
}

/**
 * Converts CSL-JSON to BibLaTeX format
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @returns {string} The BibLaTeX representation
 */
function cslJsonToBiblatex(cslJson) {
  // Ensure we're working with an array
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  let biblatexOutput = '';

  for (const citation of cslArray) {
    // Determine the entry type based on CSL type
    const biblatexType = mapCslTypeToBiblatex(citation.type);

    biblatexOutput += `@${biblatexType}{${citation.id},\n`;

    // Add title
    if (citation.title) {
      biblatexOutput += `  title = {${citation.title}},\n`;
    }

    // Add author
    if (citation.author && Array.isArray(citation.author) && citation.author.length > 0) {
      const authors = citation.author
        .map((author) => {
          if (author.family && author.given) {
            return `${author.family}, ${author.given}`;
          } else if (author.family) {
            return author.family;
          } else if (author.literal) {
            return author.literal;
          }
          return '';
        })
        .filter((name) => name !== '')
        .join(' and ');

      if (authors) {
        biblatexOutput += `  author = {${authors}},\n`;
      }
    }

    // Add editor if no author
    if (
      !citation.author &&
      citation.editor &&
      Array.isArray(citation.editor) &&
      citation.editor.length > 0
    ) {
      const editors = citation.editor
        .map((editor) => {
          if (editor.family && editor.given) {
            return `${editor.family}, ${editor.given}`;
          } else if (editor.family) {
            return editor.family;
          } else if (editor.literal) {
            return editor.literal;
          }
          return '';
        })
        .filter((name) => name !== '')
        .join(' and ');

      if (editors) {
        biblatexOutput += `  editor = {${editors}},\n`;
      }
    }

    // Add book title for chapters
    if (citation['container-title'] && citation.type === 'chapter') {
      biblatexOutput += `  booktitle = {${citation['container-title']}},\n`;
    }

    // Add journal title for articles
    if (citation['container-title'] && citation.type.includes('article')) {
      biblatexOutput += `  journal = {${citation['container-title']}},\n`;
    }

    // Add publisher
    if (citation.publisher) {
      biblatexOutput += `  publisher = {${citation.publisher}},\n`;
    }

    // Add location (address)
    if (citation['publisher-place']) {
      biblatexOutput += `  address = {${citation['publisher-place']}},\n`;
    }

    // Add year
    if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
      const year = citation.issued['date-parts'][0][0];
      biblatexOutput += `  year = {${year}},\n`;
    }

    // Add volume
    if (citation.volume) {
      biblatexOutput += `  volume = {${citation.volume}},\n`;
    }

    // Add issue (number in BibLaTeX)
    if (citation.issue) {
      biblatexOutput += `  number = {${citation.issue}},\n`;
    }

    // Add pages
    if (citation.page) {
      biblatexOutput += `  pages = {${citation.page}},\n`;
    }

    // Add DOI
    if (citation.DOI) {
      biblatexOutput += `  doi = {${citation.DOI}},\n`;
    }

    // Add URL
    if (citation.URL) {
      biblatexOutput += `  url = {${citation.URL}},\n`;
    }

    // Add ISBN
    if (citation.ISBN) {
      biblatexOutput += `  isbn = {${citation.ISBN}},\n`;
    }

    // Add chapter for book chapters
    if (citation['chapter-number']) {
      biblatexOutput += `  chapter = {${citation['chapter-number']}},\n`;
    }

    // Close the entry
    biblatexOutput += '}\n\n';
  }

  return biblatexOutput.trim();
}

/**
 * Maps CSL types to BibLaTeX types
 * @param {string} cslType - The CSL type
 * @returns {string} The corresponding BibLaTeX type
 */
function mapCslTypeToBiblatex(cslType) {
  const typeMap = {
    article: 'article',
    'article-journal': 'article',
    'article-magazine': 'article',
    'article-newspaper': 'article',
    bill: 'legislation',
    book: 'book',
    broadcast: 'misc',
    chapter: 'inbook',
    dataset: 'dataset',
    entry: 'inreference',
    'entry-dictionary': 'inreference',
    'entry-encyclopedia': 'inreference',
    event: 'misc',
    figure: 'misc',
    graphic: 'image',
    hearing: 'legislation',
    interview: 'misc',
    legal_case: 'jurisdiction',
    legislation: 'legislation',
    manuscript: 'unpublished',
    map: 'misc',
    motion_picture: 'movie',
    musical_score: 'collection',
    pamphlet: 'booklet',
    'paper-conference': 'inproceedings',
    patent: 'patent',
    personal_communication: 'misc',
    post: 'online',
    'post-weblog': 'online',
    regulation: 'legislation',
    report: 'report',
    review: 'article',
    'review-book': 'article',
    song: 'audio',
    speech: 'unpublished',
    thesis: 'thesis',
    treaty: 'legislation',
    webpage: 'online',
  };

  return typeMap[cslType] || 'misc';
}

/**
 * Converts CSL-JSON to EndNote XML format
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @returns {string} EndNote XML content
 */
function convertCslToJsonToEndnoteXml(cslJson) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  let xmlOutput = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlOutput += '<xml>\n<records>\n';

  for (const citation of cslArray) {
    xmlOutput += '  <record>\n';

    // Map CSL type to EndNote type
    const endnoteType = mapCslTypeToEndnote(citation.type);
    xmlOutput += `    <ref-type name="${endnoteType}">${getTypeNumber(endnoteType)}</ref-type>\n`;

    // Add contributors (authors/editors)
    if (citation.author && Array.isArray(citation.author) && citation.author.length > 0) {
      xmlOutput += '    <contributors>\n      <authors>\n';
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
          xmlOutput += `        <author>${escapeXmlValue(authorName)}</author>\n`;
        }
      }
      xmlOutput += '      </authors>\n    </contributors>\n';
    }

    // Add title
    if (citation.title) {
      xmlOutput += `    <titles>\n      <title>${escapeXmlValue(citation.title)}</title>\n    </titles>\n`;
    }

    // Add secondary title (journal, book, etc.)
    if (citation['container-title']) {
      xmlOutput += `    <secondary-title>${escapeXmlValue(citation['container-title'])}</secondary-title>\n`;
    }

    // Add publisher
    if (citation.publisher) {
      xmlOutput += `    <publisher>${escapeXmlValue(citation.publisher)}</publisher>\n`;
    }

    // Add publication year
    if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
      const year = citation.issued['date-parts'][0][0];
      xmlOutput += `    <dates>\n      <year>${year}</year>\n    </dates>\n`;
    }

    // Add volume and issue
    if (citation.volume) {
      xmlOutput += `    <volume>${citation.volume}</volume>\n`;
    }

    if (citation.issue) {
      xmlOutput += `    <number>${citation.issue}</number>\n`;
    }

    // Add pages
    if (citation.page) {
      xmlOutput += `    <pages>${citation.page}</pages>\n`;
    }

    // Add DOI
    if (citation.DOI) {
      xmlOutput += `    <electronic-resource-num>${escapeXmlValue(citation.DOI)}</electronic-resource-num>\n`;
    }

    // Add URL
    if (citation.URL) {
      xmlOutput += `    <urls>\n      <related-urls>\n        <url>${escapeXmlValue(citation.URL)}</url>\n      </related-urls>\n    </urls>\n`;
    }

    xmlOutput += '  </record>\n';
  }

  xmlOutput += '</records>\n</xml>';

  return xmlOutput;
}

/**
 * Converts CSL-JSON to EndNote Tagged Format (ENW)
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @returns {string} EndNote Tagged Format content
 */
function convertCslToJsonToEndnoteTagged(cslJson) {
  const cslArray = Array.isArray(cslJson) ? cslJson : [cslJson];

  let enwOutput = '';

  for (const citation of cslArray) {
    // Map CSL type to ENW type
    const enwType = mapCslTypeToEnw(citation.type);
    enwOutput += `%0 ${enwType}\n`;

    // Add title
    if (citation.title) {
      enwOutput += `%T ${citation.title}\n`;
    }

    // Add authors
    if (citation.author && Array.isArray(citation.author)) {
      for (const author of citation.author) {
        let authorName = '';
        if (author.family) {
          authorName = author.family;
          if (author.given) {
            authorName += ', ' + author.given.charAt(0); // Just the first initial
          }
        } else if (author.literal) {
          authorName = author.literal;
        }

        if (authorName) {
          enwOutput += `%A ${authorName}\n`;
        }
      }
    }

    // Add secondary title (journal, book, etc.)
    if (citation['container-title']) {
      enwOutput += `%B ${citation['container-title']}\n`;
    }

    // Add publisher
    if (citation.publisher) {
      enwOutput += `%I ${citation.publisher}\n`;
    }

    // Add publication year
    if (citation.issued && citation.issued['date-parts'] && citation.issued['date-parts'][0]) {
      const year = citation.issued['date-parts'][0][0];
      enwOutput += `%D ${year}\n`;
    }

    // Add volume
    if (citation.volume) {
      enwOutput += `%V ${citation.volume}\n`;
    }

    // Add issue
    if (citation.issue) {
      enwOutput += `%N ${citation.issue}\n`;
    }

    // Add pages
    if (citation.page) {
      enwOutput += `%P ${citation.page}\n`;
    }

    // Add URL
    if (citation.URL) {
      enwOutput += `%U ${citation.URL}\n`;
    }

    // Add DOI
    if (citation.DOI) {
      enwOutput += `%R ${citation.DOI}\n`;
    }

    // Add notes
    enwOutput += `%9 ${citation.type || 'Article'}\n`;

    // End of record
    enwOutput += '\n';
  }

  return enwOutput.trim();
}

/**
 * Maps CSL types to EndNote types
 * @param {string} cslType - The CSL type
 * @returns {string} The corresponding EndNote type
 */
function mapCslTypeToEndnote(cslType) {
  const typeMap = {
    book: 'Book',
    chapter: 'Book Section',
    'article-journal': 'Journal Article',
    'article-magazine': 'Magazine Article',
    'article-newspaper': 'Newspaper Article',
    'paper-conference': 'Conference Proceedings',
    thesis: 'Thesis',
    manuscript: 'Manuscript',
    patent: 'Patent',
    webpage: 'Web Page',
    report: 'Report',
    bill: 'Bill',
    hearing: 'Hearing',
    legal_case: 'Case',
    legislation: 'Statute',
    motion_picture: 'Film',
    song: 'Music',
    speech: 'Speech',
    personal_communication: 'Personal Communication',
  };

  return typeMap[cslType] || 'Generic';
}

/**
 * Maps CSL types to ENW types
 * @param {string} cslType - The CSL type
 * @returns {string} The corresponding ENW type
 */
function mapCslTypeToEnw(cslType) {
  const typeMap = {
    book: 'Book',
    chapter: 'Book Section',
    'article-journal': 'Journal Article',
    'article-magazine': 'Magazine Article',
    'article-newspaper': 'Newspaper Article',
    'paper-conference': 'Conference Paper',
    thesis: 'Thesis',
    manuscript: 'Manuscript',
    patent: 'Patent',
    webpage: 'Web Page',
    report: 'Report',
    bill: 'Bill',
    hearing: 'Hearing',
    legal_case: 'Legal Case',
    legislation: 'Legislation',
    motion_picture: 'Film',
    song: 'Song',
    speech: 'Speech',
    personal_communication: 'Personal Communication',
  };

  return typeMap[cslType] || 'Generic';
}

/**
 * Gets the EndNote type number for a given type
 * @param {string} typeName - The EndNote type name
 * @returns {string} The type number
 */
function getTypeNumber(typeName) {
  const numberMap = {
    Book: '6',
    'Book Section': '5',
    'Journal Article': '1',
    'Magazine Article': '15',
    'Newspaper Article': '16',
    'Conference Proceedings': '10',
    Thesis: '32',
    Manuscript: '35',
    Patent: '22',
    'Web Page': '12',
    Report: '27',
    Bill: '13',
    Hearing: '14',
    Case: '23',
    Statute: '18',
    Film: '20',
    Music: '21',
    Speech: '24',
    'Personal Communication': '37',
    Generic: '0',
  };

  return numberMap[typeName] || '0';
}

/**
 * Escapes a value for safe use in XML
 * @param {any} value - The value to escape
 * @returns {string} The escaped value
 */
function escapeXmlValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Validates EndNote XML output
 * @param {string} xmlContent - The EndNote XML content to validate
 * @returns {Object} Validation result
 */
function validateEndnoteXml(xmlContent) {
  const errors = [];
  const warnings = [];

  if (!xmlContent || xmlContent.trim() === '') {
    errors.push('EndNote XML content is empty');
    return { isValid: false, errors, warnings, format: 'EndNote XML' };
  }

  // Basic XML structure checks
  if (!xmlContent.includes('<xml>') || !xmlContent.includes('</xml>')) {
    errors.push('Missing root <xml> element');
  }

  if (!xmlContent.includes('<records>') || !xmlContent.includes('</records>')) {
    errors.push('Missing <records> container element');
  }

  // Check for records
  const recordCount = (xmlContent.match(/<record>/g) || []).length;
  const endRecordCount = (xmlContent.match(/<\/record>/g) || []).length;

  if (recordCount !== endRecordCount) {
    errors.push(`Mismatched record tags: ${recordCount} opening, ${endRecordCount} closing`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    format: 'EndNote XML',
  };
}

/**
 * Validates ENW (EndNote Tagged) output
 * @param {string} enwContent - The ENW content to validate
 * @returns {Object} Validation result
 */
function validateEnw(enwContent) {
  const errors = [];
  const warnings = [];

  if (!enwContent || enwContent.trim() === '') {
    errors.push('ENW content is empty');
    return { isValid: false, errors, warnings, format: 'ENW' };
  }

  // Check for required fields in each entry
  const entries = enwContent.split(/\n\s*\n/); // Split by double newlines

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.trim() === '') continue;

    // Check for required ENW fields
    if (!entry.includes('%0 ')) {
      warnings.push(`Entry ${i + 1}: Missing required type field (%0)`);
    }

    if (!entry.includes('%T ') && !entry.includes('# ')) {
      warnings.push(`Entry ${i + 1}: Missing title field (%T) or header`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    format: 'ENW',
  };
}

/**
 * Batch converts CSL-JSON to multiple formats
 * @param {Array|Object} cslJson - The CSL-JSON data to convert
 * @param {Array<string>} formats - Array of formats to convert to
 * @param {Object} options - Additional options for conversion
 * @returns {Object} Object with converted content for each format
 */
export function batchConvert(cslJson, formats, options = {}) {
  const results = {};

  for (const format of formats) {
    results[format] = formatConverter(cslJson, format, options);
  }

  return results;
}

/**
 * Converts a file from one format to another
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to save the output file
 * @param {string} outputFormat - The target format
 * @param {Object} options - Additional options for conversion
 * @returns {Promise<Object>} Conversion result
 */
export async function convertFile(inputPath, outputPath, outputFormat, options = {}) {
  try {
    const fs = await import('fs/promises');

    // Read the input file
    const inputContent = await fs.readFile(inputPath, 'utf8');
    const cslJson = JSON.parse(inputContent);

    // Convert to the target format
    const result = formatConverter(cslJson, outputFormat, options);

    if (!result.isValid) {
      return {
        success: false,
        error: `Conversion failed: ${result.errors.join(', ')}`,
        result,
      };
    }

    // Write the output file
    await fs.writeFile(outputPath, result.content, 'utf8');

    return {
      success: true,
      outputPath,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Export the main function as the default
export default formatConverter;
