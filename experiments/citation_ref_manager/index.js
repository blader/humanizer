/**
 * Citation Reference Manager - Main Entry Point
 * Aggregates all functionality for the citation reference management system
 */

// Export subskill functions
export { default as validateCitations } from './subskills/validate_citations.js';
export { default as enrichReferences } from './subskills/enrich_references.js';
export { default as formatConverter } from './subskills/format_converter.js';
export { default as referenceVerifier } from './subskills/reference_verifier.js';

// Export utility functions and classes
export {
  CanonicalStorage,
  validateCslJsonSchema,
  validateRequiredFields,
  findCitationKeysInManuscript,
  verifyManuscriptCitations,
  calculateConfidenceScore,
  needsManualVerification,
  humanizeCitations,
} from './utils.js';

// Export format conversion functions from utils
export { cslJsonToYaml, cslJsonToRis } from './utils.js';
