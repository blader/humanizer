# Humanizer

A Claude Code skill that removes signs of AI-generated writing from text, making it sound more natural and human. Supports **English** and **German** with automatic language detection.

## Installation

### Recommended (clone directly into Claude Code skills directory)

```bash
mkdir -p ~/.claude/skills
git clone https://github.com/blader/humanizer.git ~/.claude/skills/humanizer
```

### Manual install/update (only the skill file)

If you already have this repo cloned (or you downloaded `SKILL.md`), copy the skill file into Claude Code's skills directory:

```bash
mkdir -p ~/.claude/skills/humanizer
cp SKILL.md ~/.claude/skills/humanizer/
```

## Usage

### Universal (auto-detects language)

```
/humanizer

[paste your text here - English or German]
```

The skill automatically detects the language and applies the appropriate patterns.

### Language-specific skills

For explicit language control:

```
/humanizer-en    # English patterns only
/humanizer-de    # German patterns only (Deutsche Muster)
```

Or ask Claude directly:

```
Please humanize this text: [your text]
```

## Skill Files

| File | Skill Name | Description |
|------|------------|-------------|
| `SKILL.md` | `humanizer` | Universal with auto language detection (EN/DE) |
| `SKILL-EN.md` | `humanizer-en` | English patterns only |
| `SKILL-DE.md` | `humanizer-de` | German patterns only |

## Overview

Based on Wikipedia's comprehensive AI writing detection guides:
- [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (English)
- [Wikipedia:Anzeichen für KI-generierte Inhalte](https://de.wikipedia.org/wiki/Wikipedia:Anzeichen_f%C3%BCr_KI-generierte_Inhalte) (German)

Both are maintained by WikiProject AI Cleanup. These guides come from observations of thousands of instances of AI-generated text.

### Key Insight from Wikipedia

> "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."

## 24 English Patterns

### Content Patterns

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 1 | **Significance inflation** | "marking a pivotal moment in the evolution of..." | "was established in 1989 to collect regional statistics" |
| 2 | **Notability name-dropping** | "cited in NYT, BBC, FT, and The Hindu" | "In a 2024 NYT interview, she argued..." |
| 3 | **Superficial -ing analyses** | "symbolizing... reflecting... showcasing..." | Remove or expand with actual sources |
| 4 | **Promotional language** | "nestled within the breathtaking region" | "is a town in the Gonder region" |
| 5 | **Vague attributions** | "Experts believe it plays a crucial role" | "according to a 2019 survey by..." |
| 6 | **Formulaic challenges** | "Despite challenges... continues to thrive" | Specific facts about actual challenges |

### Language Patterns

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 7 | **AI vocabulary** | "Additionally... testament... landscape... showcasing" | "also... remain common" |
| 8 | **Copula avoidance** | "serves as... features... boasts" | "is... has" |
| 9 | **Negative parallelisms** | "It's not just X, it's Y" | State the point directly |
| 10 | **Rule of three** | "innovation, inspiration, and insights" | Use natural number of items |
| 11 | **Synonym cycling** | "protagonist... main character... central figure... hero" | "protagonist" (repeat when clearest) |
| 12 | **False ranges** | "from the Big Bang to dark matter" | List topics directly |

### Style Patterns

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 13 | **Em dash overuse** | "institutions—not the people—yet this continues—" | Use commas or periods |
| 14 | **Boldface overuse** | "**OKRs**, **KPIs**, **BMC**" | "OKRs, KPIs, BMC" |
| 15 | **Inline-header lists** | "**Performance:** Performance improved" | Convert to prose |
| 16 | **Title Case Headings** | "Strategic Negotiations And Partnerships" | "Strategic negotiations and partnerships" |
| 17 | **Emojis** | "🚀 Launch Phase: 💡 Key Insight:" | Remove emojis |
| 18 | **Curly quotes** | "said "the project"" | "said \"the project\"" |

### Communication Patterns

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 19 | **Chatbot artifacts** | "I hope this helps! Let me know if..." | Remove entirely |
| 20 | **Cutoff disclaimers** | "While details are limited in available sources..." | Find sources or remove |
| 21 | **Sycophantic tone** | "Great question! You're absolutely right!" | Respond directly |

### Filler and Hedging

| # | Pattern | Before | After |
|---|---------|--------|-------|
| 22 | **Filler phrases** | "In order to", "Due to the fact that" | "To", "Because" |
| 23 | **Excessive hedging** | "could potentially possibly" | "may" |
| 24 | **Generic conclusions** | "The future looks bright" | Specific plans or facts |

## 24 German Patterns (Deutsche Muster)

### Inhaltsmuster

| # | Muster | Vorher | Nachher |
|---|--------|--------|---------|
| 1 | **Symbolik-Betonung** | "markierte einen entscheidenden Wendepunkt" | "wurde 1989 gegründet, um..." |
| 2 | **Werbesprache** | "eingebettet in die atemberaubende Region" | "ist eine Stadt in der Region" |
| 3 | **Partizip-Analysen** | "symbolisierend... widerspiegelnd..." | Konkrete Aussagen |
| 4 | **Vage Autoritäten** | "Experten glauben" | "laut einer Studie von..." |
| 5 | **Formelhafte Schlüsse** | "Trotz dieser Herausforderungen gedeiht..." | Konkrete Fakten |
| 6 | **Redaktionelle Kommentare** | "Es ist wichtig zu bemerken" | Direkt formulieren |

### Sprachmuster

| # | Muster | Vorher | Nachher |
|---|--------|--------|---------|
| 7 | **KI-Konjunktionen** | "Darüber hinaus... Zusätzlich..." | "auch... außerdem..." |
| 8 | **Fazit-Abschnitte** | "Fazit: Zusammenfassend lässt sich sagen" | Direkte Aussage |
| 9 | **Negative Parallelismen** | "Es geht nicht nur um X, sondern um Y" | Direkt formulieren |
| 10 | **Dreierregel** | "Innovation, Inspiration und Einblicke" | Natürliche Anzahl |
| 11 | **Synonymwechsel** | "Protagonist... Hauptfigur... Held" | Konsistente Begriffe |
| 12 | **Falsche Erweiterung** | "von X bis Y" (ohne echte Skala) | Direkte Auflistung |

### Stilmuster

| # | Muster | Vorher | Nachher |
|---|--------|--------|---------|
| 13 | **Gedankenstrich-Übernutzung** | "—nicht von den Menschen—dennoch—" | Kommata oder Punkte |
| 14 | **Übermäßige Fettschrift** | "**OKRs**, **KPIs**, **BMC**" | "OKRs, KPIs, BMC" |
| 15 | **Inline-Überschriften** | "**Leistung:** Die Leistung wurde..." | Prosa-Absatz |
| 16 | **Emojis** | "🚀 Startphase: 💡 Erkenntnis:" | Emojis entfernen |

### Kommunikationsmuster

| # | Muster | Vorher | Nachher |
|---|--------|--------|---------|
| 17 | **Chatbot-Artefakte** | "Ich hoffe, das hilft!" | Entfernen |
| 18 | **Wissenslücken-Hinweise** | "Stand meines letzten Updates..." | Quellen finden oder entfernen |
| 19 | **KI-Selbstreferenzen** | "Als KI-Sprachmodell kann ich nicht..." | Entfernen |
| 20 | **Schmeichlerischer Ton** | "Tolle Frage! Sie haben absolut recht!" | Direkt antworten |
| 21 | **Abrupte Abbrüche** | Text endet mitten im Satz | Vervollständigen oder entfernen |

### Füllwörter und Absicherungen

| # | Muster | Vorher | Nachher |
|---|--------|--------|---------|
| 22 | **Füllphrasen** | "Aufgrund der Tatsache, dass" | "Weil" |
| 23 | **Übermäßige Absicherung** | "könnte möglicherweise potenziell" | "kann" |
| 24 | **Generische Schlüsse** | "Die Zukunft sieht vielversprechend aus" | Konkrete Pläne |

## Full Example (English)

**Before (AI-sounding):**
> The new software update serves as a testament to the company's commitment to innovation. Moreover, it provides a seamless, intuitive, and powerful user experience—ensuring that users can accomplish their goals efficiently. It's not just an update, it's a revolution in how we think about productivity. Industry experts believe this will have a lasting impact on the entire sector, highlighting the company's pivotal role in the evolving technological landscape.

**After (Humanized):**
> The software update adds batch processing, keyboard shortcuts, and offline mode. Early feedback from beta testers has been positive, with most reporting faster task completion.

## Vollständiges Beispiel (Deutsch)

**Vorher (KI-klingend):**
> Das neue Software-Update steht als Zeugnis für das Engagement des Unternehmens für Innovation. Darüber hinaus bietet es eine nahtlose, intuitive und leistungsstarke Benutzererfahrung – gewährleistend, dass Nutzer ihre Ziele effizient erreichen können. Es geht nicht nur um ein Update, sondern um eine Revolution. Branchenexperten glauben, dass dies einen bleibenden Einfluss auf den gesamten Sektor haben wird.

**Nachher (Humanisiert):**
> Das Software-Update fügt Stapelverarbeitung, Tastenkombinationen und einen Offline-Modus hinzu. Erste Rückmeldungen von Beta-Testern waren positiv – die meisten berichten von schnellerer Aufgabenerledigung.

## References

- [Wikipedia: Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) - English source
- [Wikipedia: Anzeichen für KI-generierte Inhalte](https://de.wikipedia.org/wiki/Wikipedia:Anzeichen_f%C3%BCr_KI-generierte_Inhalte) - German source
- [WikiProject AI Cleanup](https://en.wikipedia.org/wiki/Wikipedia:WikiProject_AI_Cleanup) - Maintaining organization

## Version History

- **3.0.0** - Added German language support with auto-detection; restructured to three skill files (universal, EN, DE)
- **2.1.0** - Added before/after examples for all 24 patterns
- **2.0.0** - Complete rewrite based on raw Wikipedia article content
- **1.0.0** - Initial release

## License

MIT
