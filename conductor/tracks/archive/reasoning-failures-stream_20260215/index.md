# Track reasoning-failures-stream_20260215 Context

- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)

## Status: `new` | Priority: P0 | Dependencies: none

## Summary

LLM reasoning failures stream - source archiving, evidence cataloging, taxonomy definition, Wikipedia workflow with reversion fallback.

## Unblocks

- reasoning-stream-implementation_20260215 (taxonomy, source fragments)
- conductor-review-skill_20260215 (taxonomy schema, citation model)

## Key Outputs

- `archive/sources_manifest.json` - source provenance
- `docs/reasoning-failures-taxonomy.md` - canonical category schema
- `docs/TAXONOMY_CHANGELOG.md` - taxonomy evolution tracking
- `src/reasoning-stream/*.md` - source fragments
- `scripts/research/citation-normalize.js` - citation helper
- `docs/wikipedia-edit-history.md` - edit audit trail (success or fallback)
- `.pre-commit-config.yaml` - manifest validation hook (new)

## Risk Highlights

- Wikipedia edit may be reverted → fallback documentation in `wikipedia-edit-history.md`
- Taxonomy evolution → `TAXONOMY_CHANGELOG.md` tracks changes
