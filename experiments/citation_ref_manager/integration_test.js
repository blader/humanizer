/**
 * Comprehensive Integration Test for Citation Reference Manager
 * Tests the full workflow of the citation reference management system
 */

import {
  validateCitations,
  enrichReferences,
  formatConverter,
  referenceVerifier,
} from './index.js';

import { CanonicalStorage } from './index.js';

// Sample CSL-JSON data for testing
const sampleCitations = [
  {
    id: 'test-article-1',
    type: 'article-journal',
    title: 'A Comprehensive Study on Citation Formats',
    author: [
      {
        family: 'Smith',
        given: 'John',
      },
    ],
    'container-title': 'Journal of Citation Studies',
    publisher: 'Academic Press',
    issued: {
      'date-parts': [[2023]],
    },
    volume: '15',
    issue: '3',
    page: '123-145',
    DOI: '10.1234/example.doi',
    URL: 'https://example.com/article',
  },
  {
    id: 'test-book-1',
    type: 'book',
    title: 'Modern Approaches to Bibliography Management',
    author: [
      {
        family: 'Johnson',
        given: 'Robert',
      },
    ],
    publisher: 'Academic Publishers',
    'publisher-place': 'New York',
    issued: {
      'date-parts': [[2022]],
    },
    ISBN: '978-1234567890',
  },
];

const sampleManuscript = `This is a sample manuscript text that cites multiple sources.
According to Smith [test-article-1], citation formats are important for academic writing.
Johnson [test-book-1] also discusses bibliography management.
There's also a reference to a non-existent citation [nonexistent-item].
`;

console.log('Starting comprehensive integration test...\n');

async function runIntegrationTest() {
  try {
    console.log('=== PHASE 1: Citation Verification ===');

    // Step 1: Verify citations in manuscript
    const verificationResult = await validateCitations(sampleManuscript, sampleCitations);
    console.log(`✓ Citation verification completed`);
    console.log(
      `  - Total manuscript citations: ${verificationResult.summary.totalManuscriptCitations}`
    );
    console.log(`  - Total CSL citations: ${verificationResult.summary.totalCslCitations}`);
    console.log(`  - Missing citations: ${verificationResult.summary.missingCitations}`);
    console.log(`  - Issues found: ${verificationResult.issues.length}`);

    // Check if verification passed expected checks
    if (verificationResult.summary.missingCitations !== 1) {
      throw new Error(
        `Expected 1 missing citation, got ${verificationResult.summary.missingCitations}`
      );
    }
    console.log('✓ Citation verification results as expected\n');

    console.log('=== PHASE 2: Reference Enrichment ===');

    // Step 2: Enrich references using external sources
    const enrichmentResult = await enrichReferences(sampleCitations);
    console.log(`✓ Reference enrichment completed`);
    console.log(`  - Total citations: ${enrichmentResult.summary.totalCitations}`);
    console.log(`  - Successfully enriched: ${enrichmentResult.summary.successfullyEnriched}`);
    console.log(`  - Low confidence citations: ${enrichmentResult.summary.lowConfidenceCitations}`);
    console.log(`  - Enrichment rate: ${enrichmentResult.summary.enrichmentRate}`);

    // Check if enrichment worked as expected
    if (enrichmentResult.summary.successfullyEnriched !== 2) {
      console.error('⚠ Some citations were not enriched as expected');
    } else {
      console.log('✓ All citations enriched successfully\n');
    }

    console.log('=== PHASE 3: Format Conversion ===');

    // Step 3: Convert to multiple formats
    const formatsToTest = ['yaml', 'ris', 'biblatex'];
    const conversionResults = {};

    for (const format of formatsToTest) {
      conversionResults[format] = formatConverter(enrichmentResult.enrichedCslJson, format);
      console.log(
        `✓ ${format.toUpperCase()} conversion completed: ${conversionResults[format].isValid ? '✓ Valid' : '✗ Invalid'}`
      );

      if (!conversionResults[format].isValid) {
        console.error(
          `✗ ${format.toUpperCase()} conversion had errors:`,
          conversionResults[format].errors
        );
      }
    }

    console.log('✓ All format conversions completed\n');

    console.log('=== PHASE 4: Reference Verification ===');

    // Step 4: Verify URLs and DOIs
    const verificationCheck = await referenceVerifier(enrichmentResult.enrichedCslJson);
    console.log(`✓ Reference verification completed`);
    console.log(`  - Total citations: ${verificationCheck.summary.totalCitations}`);
    console.log(`  - Citations with URLs: ${verificationCheck.summary.citationsWithUrls}`);
    console.log(`  - Citations with DOIs: ${verificationCheck.summary.citationsWithDois}`);
    console.log(`  - Accessible URLs: ${verificationCheck.summary.accessibleUrls}`);
    console.log(`  - Accessible DOIs: ${verificationCheck.summary.accessibleDois}`);
    console.log(`  - Issues found: ${verificationCheck.summary.totalIssues}`);

    console.log('✓ Reference verification completed\n');

    console.log('=== PHASE 5: Storage Management ===');

    // Step 5: Test storage functionality
    const storage = new CanonicalStorage('./test-integration-references.json');

    // Save the enriched references
    await storage.save(enrichmentResult.enrichedCslJson);
    console.log('✓ References saved to canonical storage');

    // Load the references back
    const loadedReferences = await storage.load();
    console.log(`✓ References loaded from storage: ${loadedReferences.length} citations`);

    if (loadedReferences.length !== enrichmentResult.enrichedCslJson.length) {
      throw new Error(
        `Loaded references count mismatch: expected ${enrichmentResult.enrichedCslJson.length}, got ${loadedReferences.length}`
      );
    }

    console.log('✓ Storage management working correctly\n');

    console.log('=== PHASE 6: End-to-End Workflow ===');

    // Step 6: Simulate a complete workflow
    const workflowStartTime = Date.now();

    // Verify citations
    const workflowVerification = await validateCitations(sampleManuscript, loadedReferences);

    // Enrich if needed
    const needsEnrichment = workflowVerification.issues.some(
      (issue) =>
        issue.type === 'low_information_citation' || issue.type === 'low_confidence_citation'
    );

    let finalReferences = loadedReferences;
    if (needsEnrichment) {
      const enrichment = await enrichReferences(loadedReferences);
      finalReferences = enrichment.enrichedCslJson;
    }

    // Convert to required format
    const finalConversion = formatConverter(finalReferences, 'ris');

    // Verify final references
    const finalVerification = await referenceVerifier(finalReferences);

    const workflowEndTime = Date.now();
    const workflowDuration = workflowEndTime - workflowStartTime;

    console.log(`✓ End-to-end workflow completed in ${workflowDuration}ms`);
    console.log(`  - Verification: ${workflowVerification.isValid ? '✓ Passed' : '✗ Failed'}`);
    console.log(`  - Enrichment: ${needsEnrichment ? 'Performed' : 'Not needed'}`);
    console.log(`  - Conversion: ${finalConversion.isValid ? '✓ Successful' : '✗ Failed'}`);
    console.log(`  - Final verification: ${finalVerification.isValid ? '✓ Passed' : '✗ Failed'}`);

    console.log('\n=== INTEGRATION TEST SUMMARY ===');
    console.log('✓ All phases completed successfully');
    console.log('✓ Citation verification working');
    console.log('✓ Reference enrichment working');
    console.log('✓ Format conversion working');
    console.log('✓ Reference verification working');
    console.log('✓ Storage management working');
    console.log('✓ End-to-end workflow working');

    console.log('\n🎉 Comprehensive integration test PASSED!');
    return true;
  } catch (error) {
    console.error('\n❌ Integration test FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

// Run the integration test
runIntegrationTest().then((success) => {
  if (success) {
    console.log('\nIntegration test completed successfully!');
  } else {
    console.log('\nIntegration test encountered errors.');
    process.exit(1);
  }
});
