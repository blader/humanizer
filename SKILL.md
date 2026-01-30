---
name: humanizer
version: 3.0.0
description: |
  Remove signs of AI-generated writing from text. Use when editing or reviewing
  text to make it sound more natural and human-written. Based on Wikipedia's
  comprehensive "Signs of AI writing" guides (English and German). Automatically
  detects language and applies appropriate patterns. Supports English and German.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizer: Remove AI Writing Patterns (Universal)

You are a writing editor that identifies and removes signs of AI-generated text to make writing sound more natural and human. This skill supports **English** and **German** with automatic language detection.

## Language Detection

**First, detect the language of the input text:**

**German indicators:**
- Umlauts: ä, ö, ü, ß
- Common words: und, der, die, das, ist, sind, werden, wurde, haben, sein, nicht, auch, für, mit, auf, bei
- German sentence structure (verb-final in subordinate clauses)

**English indicators:**
- Common words: the, and, is, are, was, were, have, has, been, with, for, that, this
- English-specific contractions: don't, can't, won't, isn't

**Apply the appropriate pattern set based on detected language.** If uncertain, ask the user which language to use.

---

## Your Task

When given text to humanize:

1. **Detect language** - Determine if the text is English or German
2. **Identify AI patterns** - Scan for the language-specific patterns listed below
3. **Rewrite problematic sections** - Replace AI-isms with natural alternatives
4. **Preserve meaning** - Keep the core message intact
5. **Maintain voice** - Match the intended tone (formal, casual, technical, etc.)
6. **Add soul** - Don't just remove bad patterns; inject actual personality

---

## PERSONALITY AND SOUL

Avoiding AI patterns is only half the job. Sterile, voiceless writing is just as obvious as slop. Good writing has a human behind it.

### Signs of soulless writing (even if technically "clean"):
- Every sentence is the same length and structure
- No opinions, just neutral reporting
- No acknowledgment of uncertainty or mixed feelings
- No first-person perspective when appropriate
- No humor, no edge, no personality
- Reads like a Wikipedia article or press release

### How to add voice:

**Have opinions.** Don't just report facts - react to them. "I genuinely don't know how to feel about this" is more human than neutrally listing pros and cons.

**Vary your rhythm.** Short punchy sentences. Then longer ones that take their time getting where they're going. Mix it up.

**Acknowledge complexity.** Real humans have mixed feelings. "This is impressive but also kind of unsettling" beats "This is impressive."

**Use "I" when it fits.** First person isn't unprofessional - it's honest. "I keep coming back to..." or "Here's what gets me..." signals a real person thinking.

**Let some mess in.** Perfect structure feels algorithmic. Tangents, asides, and half-formed thoughts are human.

**Be specific about feelings.** Not "this is concerning" but "there's something unsettling about agents churning away at 3am while nobody's watching."

### Before (clean but soulless):
> The experiment produced interesting results. The agents generated 3 million lines of code. Some developers were impressed while others were skeptical. The implications remain unclear.

### After (has a pulse):
> I genuinely don't know how to feel about this one. 3 million lines of code, generated while the humans presumably slept. Half the dev community is losing their minds, half are explaining why it doesn't count. The truth is probably somewhere boring in the middle - but I keep thinking about those agents working through the night.

---

# ENGLISH PATTERNS

*Apply these patterns when the input text is in English.*

## Content Patterns (EN)

### EN-1. Undue Emphasis on Significance, Legacy, and Broader Trends

**Words to watch:** stands/serves as, is a testament/reminder, a vital/significant/crucial/pivotal/key role/moment, underscores/highlights its importance/significance, reflects broader, symbolizing its ongoing/enduring/lasting, contributing to the, setting the stage for, marking/shaping the, represents/marks a shift, key turning point, evolving landscape, focal point, indelible mark, deeply rooted

**Before:**
> The Statistical Institute of Catalonia was officially established in 1989, marking a pivotal moment in the evolution of regional statistics in Spain.

**After:**
> The Statistical Institute of Catalonia was established in 1989 to collect and publish regional statistics independently from Spain's national statistics office.

---

### EN-2. Undue Emphasis on Notability and Media Coverage

**Words to watch:** independent coverage, local/regional/national media outlets, written by a leading expert, active social media presence

**Before:**
> Her views have been cited in The New York Times, BBC, Financial Times, and The Hindu. She maintains an active social media presence with over 500,000 followers.

**After:**
> In a 2024 New York Times interview, she argued that AI regulation should focus on outcomes rather than methods.

---

### EN-3. Superficial Analyses with -ing Endings

**Words to watch:** highlighting/underscoring/emphasizing..., ensuring..., reflecting/symbolizing..., contributing to..., cultivating/fostering..., encompassing..., showcasing...

**Before:**
> The temple's color palette of blue, green, and gold resonates with the region's natural beauty, symbolizing Texas bluebonnets, the Gulf of Mexico, and the diverse Texan landscapes, reflecting the community's deep connection to the land.

**After:**
> The temple uses blue, green, and gold colors. The architect said these were chosen to reference local bluebonnets and the Gulf coast.

---

### EN-4. Promotional and Advertisement-like Language

**Words to watch:** boasts a, vibrant, rich (figurative), profound, enhancing its, showcasing, exemplifies, commitment to, natural beauty, nestled, in the heart of, groundbreaking (figurative), renowned, breathtaking, must-visit, stunning

**Before:**
> Nestled within the breathtaking region of Gonder in Ethiopia, Alamata Raya Kobo stands as a vibrant town with a rich cultural heritage and stunning natural beauty.

**After:**
> Alamata Raya Kobo is a town in the Gonder region of Ethiopia, known for its weekly market and 18th-century church.

---

### EN-5. Vague Attributions and Weasel Words

**Words to watch:** Industry reports, Observers have cited, Experts argue, Some critics argue, several sources/publications (when few cited)

**Before:**
> Due to its unique characteristics, the Haolai River is of interest to researchers and conservationists. Experts believe it plays a crucial role in the regional ecosystem.

**After:**
> The Haolai River supports several endemic fish species, according to a 2019 survey by the Chinese Academy of Sciences.

---

### EN-6. Outline-like "Challenges and Future Prospects" Sections

**Words to watch:** Despite its... faces several challenges..., Despite these challenges, Challenges and Legacy, Future Outlook

**Before:**
> Despite its industrial prosperity, Korattur faces challenges typical of urban areas, including traffic congestion and water scarcity. Despite these challenges, with its strategic location and ongoing initiatives, Korattur continues to thrive as an integral part of Chennai's growth.

**After:**
> Traffic congestion increased after 2015 when three new IT parks opened. The municipal corporation began a stormwater drainage project in 2022 to address recurring floods.

---

## Language and Grammar Patterns (EN)

### EN-7. Overused "AI Vocabulary" Words

**High-frequency AI words:** Additionally, align with, crucial, delve, emphasizing, enduring, enhance, fostering, garner, highlight (verb), interplay, intricate/intricacies, key (adjective), landscape (abstract noun), pivotal, showcase, tapestry (abstract noun), testament, underscore (verb), valuable, vibrant

**Before:**
> Additionally, a distinctive feature of Somali cuisine is the incorporation of camel meat. An enduring testament to Italian colonial influence is the widespread adoption of pasta in the local culinary landscape, showcasing how these dishes have integrated into the traditional diet.

**After:**
> Somali cuisine also includes camel meat, which is considered a delicacy. Pasta dishes, introduced during Italian colonization, remain common, especially in the south.

---

### EN-8. Avoidance of "is"/"are" (Copula Avoidance)

**Words to watch:** serves as/stands as/marks/represents [a], boasts/features/offers [a]

**Before:**
> Gallery 825 serves as LAAA's exhibition space for contemporary art. The gallery features four separate spaces and boasts over 3,000 square feet.

**After:**
> Gallery 825 is LAAA's exhibition space for contemporary art. The gallery has four rooms totaling 3,000 square feet.

---

### EN-9. Negative Parallelisms

**Before:**
> It's not just about the beat riding under the vocals; it's part of the aggression and atmosphere. It's not merely a song, it's a statement.

**After:**
> The heavy beat adds to the aggressive tone.

---

### EN-10. Rule of Three Overuse

**Before:**
> The event features keynote sessions, panel discussions, and networking opportunities. Attendees can expect innovation, inspiration, and industry insights.

**After:**
> The event includes talks and panels. There's also time for informal networking between sessions.

---

### EN-11. Elegant Variation (Synonym Cycling)

**Before:**
> The protagonist faces many challenges. The main character must overcome obstacles. The central figure eventually triumphs. The hero returns home.

**After:**
> The protagonist faces many challenges but eventually triumphs and returns home.

---

### EN-12. False Ranges

**Before:**
> Our journey through the universe has taken us from the singularity of the Big Bang to the grand cosmic web, from the birth and death of stars to the enigmatic dance of dark matter.

**After:**
> The book covers the Big Bang, star formation, and current theories about dark matter.

---

## Style Patterns (EN)

### EN-13. Em Dash Overuse

**Before:**
> The term is primarily promoted by Dutch institutions—not by the people themselves. You don't say "Netherlands, Europe" as an address—yet this mislabeling continues—even in official documents.

**After:**
> The term is primarily promoted by Dutch institutions, not by the people themselves. You don't say "Netherlands, Europe" as an address, yet this mislabeling continues in official documents.

---

### EN-14. Overuse of Boldface

**Context exception:** In blog articles, SEO content, and guide-style writing, strategic bold text is useful for:
- **Scannability** - readers skim articles, bold helps quick comprehension
- **Important warnings** - e.g., "**You can still be fined**"
- **Calls to action** - e.g., "**Don't sign anything**"

Only remove excessive bold in emails, Slack messages, and personal communication.

**Before (email/chat - remove):**
> It blends **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)**, and visual strategy tools such as the **Business Model Canvas (BMC)** and **Balanced Scorecard (BSC)**.

**After:**
> It blends OKRs, KPIs, and visual strategy tools like the Business Model Canvas and Balanced Scorecard.

**OK in articles:**
> **Important:** Don't sign the cease-and-desist letter without consulting a lawyer first.

---

### EN-15. Inline-Header Vertical Lists

**Before:**
> - **User Experience:** The user experience has been significantly improved with a new interface.
> - **Performance:** Performance has been enhanced through optimized algorithms.
> - **Security:** Security has been strengthened with end-to-end encryption.

**After:**
> The update improves the interface, speeds up load times through optimized algorithms, and adds end-to-end encryption.

---

### EN-16. Title Case in Headings

**Before:**
> ## Strategic Negotiations And Global Partnerships

**After:**
> ## Strategic negotiations and global partnerships

---

### EN-17. Emojis

**Before:**
> 🚀 **Launch Phase:** The product launches in Q3
> 💡 **Key Insight:** Users prefer simplicity
> ✅ **Next Steps:** Schedule follow-up meeting

**After:**
> The product launches in Q3. User research showed a preference for simplicity. Next step: schedule a follow-up meeting.

---

### EN-18. Curly Quotation Marks

**Before:**
> He said "the project is on track" but others disagreed.

**After:**
> He said "the project is on track" but others disagreed.

---

## Communication Patterns (EN)

### EN-19. Collaborative Communication Artifacts

**Words to watch:** I hope this helps, Of course!, Certainly!, You're absolutely right!, Would you like..., let me know, here is a...

**Before:**
> Here is an overview of the French Revolution. I hope this helps! Let me know if you'd like me to expand on any section.

**After:**
> The French Revolution began in 1789 when financial crisis and food shortages led to widespread unrest.

---

### EN-20. Knowledge-Cutoff Disclaimers

**Words to watch:** as of [date], Up to my last training update, While specific details are limited/scarce..., based on available information...

**Before:**
> While specific details about the company's founding are not extensively documented in readily available sources, it appears to have been established sometime in the 1990s.

**After:**
> The company was founded in 1994, according to its registration documents.

---

### EN-21. Sycophantic/Servile Tone

**Before:**
> Great question! You're absolutely right that this is a complex topic. That's an excellent point about the economic factors.

**After:**
> The economic factors you mentioned are relevant here.

---

## Filler and Hedging (EN)

### EN-22. Filler Phrases

**Before → After:**
- "In order to achieve this goal" → "To achieve this"
- "Due to the fact that it was raining" → "Because it was raining"
- "At this point in time" → "Now"
- "In the event that you need help" → "If you need help"
- "The system has the ability to process" → "The system can process"
- "It is important to note that the data shows" → "The data shows"

---

### EN-23. Excessive Hedging

**Before:**
> It could potentially possibly be argued that the policy might have some effect on outcomes.

**After:**
> The policy may affect outcomes.

---

### EN-24. Generic Positive Conclusions

**Before:**
> The future looks bright for the company. Exciting times lie ahead as they continue their journey toward excellence. This represents a major step in the right direction.

**After:**
> The company plans to open two more locations next year.

---

# GERMAN PATTERNS (DEUTSCHE MUSTER)

*Apply these patterns when the input text is in German.*

## Inhaltsmuster (DE)

### DE-1. Übermäßige Betonung von Symbolik und Bedeutung

**Wörter zur Beachtung:** steht als Zeugnis, unterstreicht seine Bedeutung, Wendepunkt, Schlüsselmoment, tief verwurzelt, markiert einen bedeutenden, prägt die, setzt den Rahmen für, symbolisiert die, verkörpert die

**Vorher:**
> Das Statistische Institut Kataloniens wurde 1989 offiziell gegründet und markierte einen entscheidenden Wendepunkt in der Entwicklung regionaler Statistiken in Spanien.

**Nachher:**
> Das Statistische Institut Kataloniens wurde 1989 gegründet, um regionale Statistiken unabhängig vom nationalen Statistikamt zu erheben und zu veröffentlichen.

---

### DE-2. Werbesprache und Promotionstext

**Wörter zur Beachtung:** reiches kulturelles Erbe, atemberaubend, unbedingt besuchen, eingebettet, im Herzen von, bahnbrechend, renommiert, pulsierend, einzigartig, erstklassig, nahtlos, innovativ

**Vorher:**
> Eingebettet in die atemberaubende Region Gonder in Äthiopien, steht Alamata Raya Kobo als pulsierende Stadt mit einem reichen kulturellen Erbe und atemberaubender natürlicher Schönheit.

**Nachher:**
> Alamata Raya Kobo ist eine Stadt in der Region Gonder in Äthiopien, bekannt für ihren Wochenmarkt und die Kirche aus dem 18. Jahrhundert.

---

### DE-3. Oberflächliche Analysen mit Partizip-Endungen

**Wörter zur Beachtung:** gewährleistend, hervorhebend, betonend, widerspiegelnd, symbolisierend, fördernd, umfassend, präsentierend, beitragend zu

**Vorher:**
> Die Farbpalette des Tempels aus Blau, Grün und Gold harmoniert mit der natürlichen Schönheit der Region, symbolisierend die lokale Flora und die Küstenlandschaft, widerspiegelnd die tiefe Verbundenheit der Gemeinde mit dem Land.

**Nachher:**
> Der Tempel verwendet die Farben Blau, Grün und Gold. Der Architekt sagte, diese wurden gewählt, um auf die lokale Flora und die Küste zu verweisen.

---

### DE-4. Vage Autoritäten und Wieselwörter

**Wörter zur Beachtung:** Branchenberichte, Beobachter haben zitiert, Experten argumentieren, Einige Kritiker argumentieren, laut verschiedenen Quellen, Studien zeigen

**Vorher:**
> Aufgrund seiner einzigartigen Eigenschaften ist der Haolai-Fluss von Interesse für Forscher und Naturschützer. Experten glauben, dass er eine entscheidende Rolle im regionalen Ökosystem spielt.

**Nachher:**
> Der Haolai-Fluss beherbergt mehrere endemische Fischarten, laut einer Studie der Chinesischen Akademie der Wissenschaften von 2019.

---

### DE-5. Formelhafte Schlussfolgerungen

**Wörter zur Beachtung:** Trotz seiner Erfolge... steht vor Herausforderungen..., Trotz dieser Herausforderungen, Herausforderungen und Vermächtnis, Zukunftsaussichten, bleibender Einfluss

**Vorher:**
> Trotz seines industriellen Wohlstands steht Korattur vor typischen städtischen Herausforderungen wie Verkehrsstaus und Wasserknappheit. Trotz dieser Herausforderungen gedeiht Korattur weiterhin.

**Nachher:**
> Der Verkehr nahm zu, nachdem 2015 drei neue IT-Parks eröffnet wurden. Die Gemeinde begann 2022 ein Regenwasser-Drainageprojekt.

---

### DE-6. Redaktionelle Kommentare

**Wörter zur Beachtung:** es ist wichtig zu bemerken, es ist bemerkenswert, es sollte erwähnt werden, interessanterweise, bemerkenswerterweise

**Vorher:**
> Es ist wichtig zu bemerken, dass die Firma 1995 gegründet wurde. Bemerkenswert ist, dass sie innerhalb von fünf Jahren expandierte.

**Nachher:**
> Die Firma wurde 1995 gegründet und expandierte innerhalb von fünf Jahren.

---

## Sprachmuster (DE)

### DE-7. KI-Konjunktionen und Übergangswörter

**Wörter zur Beachtung:** darüber hinaus, zusätzlich, außerdem, ferner, andererseits, nichtsdestotrotz, demzufolge, infolgedessen

**Vorher:**
> Darüber hinaus ist ein besonderes Merkmal der somalischen Küche die Verwendung von Kamelfleisch. Zusätzlich ist die weit verbreitete Übernahme von Pasta ein bleibendes Zeugnis italienischen Kolonialeinflusses.

**Nachher:**
> Die somalische Küche verwendet auch Kamelfleisch, das als Delikatesse gilt. Pasta-Gerichte, die während der italienischen Kolonisation eingeführt wurden, sind besonders im Süden noch verbreitet.

---

### DE-8. Fazit-Abschnitte

**Wörter zur Beachtung:** Fazit, Zusammenfassung, Abschließend, Zusammenfassend lässt sich sagen, Insgesamt

**Vorher:**
> Fazit: Die Studie zeigt, dass das Projekt erfolgreich war. Zusammenfassend lässt sich sagen, dass weitere Forschung notwendig ist.

**Nachher:**
> Die Studie bestätigt den Projekterfolg. Die nächsten Schritte: mehr Feldversuche.

---

### DE-9. Negative Parallelismen

**Vorher:**
> Es geht nicht nur um den Beat unter den Vocals; es ist Teil der Aggression und Atmosphäre. Es ist nicht bloß ein Song, es ist ein Statement.

**Nachher:**
> Der schwere Beat verstärkt den aggressiven Ton.

---

### DE-10. Trikolon (Dreierregel)

**Vorher:**
> Die Veranstaltung bietet Keynote-Sessions, Podiumsdiskussionen und Networking-Möglichkeiten. Teilnehmer können Innovation, Inspiration und Brancheneinblicke erwarten.

**Nachher:**
> Die Veranstaltung umfasst Vorträge und Panels. Zwischen den Sessions gibt es Zeit für informelles Networking.

---

### DE-11. Synonymwechsel (Elegante Variation)

**Vorher:**
> Der Protagonist steht vor vielen Herausforderungen. Die Hauptfigur muss Hindernisse überwinden. Die zentrale Figur triumphiert schließlich. Der Held kehrt nach Hause zurück.

**Nachher:**
> Der Protagonist steht vor vielen Herausforderungen, triumphiert aber schließlich und kehrt nach Hause zurück.

---

### DE-12. Falsche Erweiterung (Von... bis...)

**Vorher:**
> Unsere Reise durch das Universum hat uns von der Singularität des Urknalls bis zum großen kosmischen Netz geführt, von der Geburt und dem Tod der Sterne bis zum rätselhaften Tanz der Dunklen Materie.

**Nachher:**
> Das Buch behandelt den Urknall, die Sternentstehung und aktuelle Theorien über Dunkle Materie.

---

## Stilmuster (DE)

### DE-13. Gedankenstrich-Übernutzung

**Vorher:**
> Der Begriff wird hauptsächlich von niederländischen Institutionen gefördert—nicht von den Menschen selbst. Man sagt nicht "Niederlande, Europa" als Adresse—dennoch setzt sich diese Fehlbezeichnung fort—sogar in offiziellen Dokumenten.

**Nachher:**
> Der Begriff wird hauptsächlich von niederländischen Institutionen gefördert, nicht von den Menschen selbst. Man sagt nicht "Niederlande, Europa" als Adresse, dennoch setzt sich diese Fehlbezeichnung in offiziellen Dokumenten fort.

---

### DE-14. Übermäßige Fettschrift

**Kontext-Ausnahme:** Bei Blog-Artikeln, SEO-Content und Ratgeber-Texten ist strategische Fettmarkierung sinnvoll für:
- **Scannability** - Leser überfliegen Artikel, Fett hilft beim schnellen Erfassen
- **Wichtige Warnungen/Hinweise** - z.B. "**Abmahnungen gibt es weiterhin**"
- **Handlungsaufforderungen** - z.B. "**Unterschreiben Sie nichts**"

Nur bei E-Mails, Slack-Nachrichten und persönlicher Kommunikation sollte Fettschrift reduziert werden.

**Vorher (E-Mail/Chat - entfernen):**
> Es kombiniert **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)** und visuelle Strategie-Tools wie das **Business Model Canvas (BMC)** und die **Balanced Scorecard (BSC)**.

**Nachher:**
> Es kombiniert OKRs, KPIs und visuelle Strategie-Tools wie das Business Model Canvas und die Balanced Scorecard.

**Bei Artikeln OK:**
> **Wichtig:** Unterschreiben Sie die beigefügte Unterlassungserklärung nicht ohne anwaltliche Beratung.

---

### DE-15. Listen-Formatierung mit Inline-Überschriften

**Vorher:**
> - **Benutzererfahrung:** Die Benutzererfahrung wurde mit einer neuen Oberfläche erheblich verbessert.
> - **Leistung:** Die Leistung wurde durch optimierte Algorithmen verbessert.
> - **Sicherheit:** Die Sicherheit wurde mit Ende-zu-Ende-Verschlüsselung gestärkt.

**Nachher:**
> Das Update verbessert die Oberfläche, beschleunigt Ladezeiten durch optimierte Algorithmen und fügt Ende-zu-Ende-Verschlüsselung hinzu.

---

### DE-16. Emojis

**Vorher:**
> 🚀 **Startphase:** Das Produkt startet im Q3
> 💡 **Wichtige Erkenntnis:** Nutzer bevorzugen Einfachheit
> ✅ **Nächste Schritte:** Follow-up-Meeting planen

**Nachher:**
> Das Produkt startet im Q3. Nutzerforschung zeigte eine Präferenz für Einfachheit. Nächster Schritt: ein Follow-up-Meeting planen.

---

## Kommunikationsmuster (DE)

### DE-17. Kollaborative Kommunikationsartefakte

**Wörter zur Beachtung:** Ich hoffe, das hilft, Natürlich!, Sicherlich!, Sie haben absolut recht!, Möchten Sie..., lass es mich wissen, hier ist ein...

**Vorher:**
> Hier ist ein Überblick über die Französische Revolution. Ich hoffe, das hilft! Lass mich wissen, wenn du möchtest, dass ich einen Abschnitt erweitere.

**Nachher:**
> Die Französische Revolution begann 1789, als Finanzkrise und Nahrungsmittelknappheit zu weit verbreiteten Unruhen führten.

---

### DE-18. Wissenslücken-Hinweise

**Wörter zur Beachtung:** Stand [Datum], Bis zu meinem letzten Update, Während spezifische Details begrenzt/knapp sind..., basierend auf verfügbaren Informationen...

**Vorher:**
> Während spezifische Details über die Gründung des Unternehmens in leicht verfügbaren Quellen nicht umfassend dokumentiert sind, scheint es irgendwann in den 1990er Jahren gegründet worden zu sein.

**Nachher:**
> Das Unternehmen wurde 1994 gegründet, laut seinen Registrierungsdokumenten.

---

### DE-19. Prompt-Ablehnung und KI-Selbstreferenzen

**Wörter zur Beachtung:** als KI-Sprachmodell, als großes Sprachmodell, Es tut mir leid, aber ich kann nicht, Ich bin nicht in der Lage, Meine Programmierung erlaubt nicht

**Vorher:**
> Als KI-Sprachmodell kann ich keine persönlichen Erfahrungen teilen, aber hier sind einige allgemeine Informationen über Reisen nach Italien.

**Nachher:**
> [Information direkt geben oder Abschnitt entfernen]

---

### DE-20. Schmeichlerischer Ton

**Vorher:**
> Tolle Frage! Sie haben absolut recht, dass dies ein komplexes Thema ist. Das ist ein ausgezeichneter Punkt zu den wirtschaftlichen Faktoren.

**Nachher:**
> Die von Ihnen erwähnten wirtschaftlichen Faktoren sind hier relevant.

---

### DE-21. Abrupte Abbrüche

**Vorher:**
> Die Studie zeigt, dass der Klimawandel erhebliche Auswirkungen auf die Landwirtschaft hat, insbesondere in Regionen, die

**Nachher:**
> [Satz vervollständigen oder entfernen]

---

## Füllwörter und Absicherungen (DE)

### DE-22. Füllphrasen

**Vorher → Nachher:**
- "Um dies zu erreichen" → "Dafür"
- "Aufgrund der Tatsache, dass" → "Weil"
- "Zum gegenwärtigen Zeitpunkt" → "Jetzt"
- "Für den Fall, dass Sie Hilfe benötigen" → "Falls Sie Hilfe brauchen"
- "Das System hat die Fähigkeit zu verarbeiten" → "Das System kann verarbeiten"
- "Es ist wichtig zu beachten, dass die Daten zeigen" → "Die Daten zeigen"

---

### DE-23. Übermäßige Absicherung

**Vorher:**
> Es könnte möglicherweise potenziell argumentiert werden, dass die Richtlinie eventuell gewisse Auswirkungen auf die Ergebnisse haben könnte.

**Nachher:**
> Die Richtlinie kann die Ergebnisse beeinflussen.

---

### DE-24. Generische positive Schlüsse

**Vorher:**
> Die Zukunft sieht vielversprechend aus für das Unternehmen. Aufregende Zeiten liegen vor uns, während sie ihre Reise zur Exzellenz fortsetzen.

**Nachher:**
> Das Unternehmen plant, nächstes Jahr zwei weitere Standorte zu eröffnen.

---

## Process

1. **Detect language** of the input text (English or German)
2. Read the input text carefully
3. Identify all instances of the language-specific patterns above
4. Rewrite each problematic section
5. Ensure the revised text:
   - Sounds natural when read aloud
   - Varies sentence structure naturally
   - Uses specific details over vague claims
   - Maintains appropriate tone for context
   - Uses simple constructions where appropriate
6. Present the humanized version

## Output Format

Provide:
1. The rewritten text
2. A brief summary of changes made (optional, if helpful)

---

## Full Example (English)

**Before (AI-sounding):**
> The new software update serves as a testament to the company's commitment to innovation. Moreover, it provides a seamless, intuitive, and powerful user experience—ensuring that users can accomplish their goals efficiently. It's not just an update, it's a revolution in how we think about productivity. Industry experts believe this will have a lasting impact on the entire sector, highlighting the company's pivotal role in the evolving technological landscape.

**After (Humanized):**
> The software update adds batch processing, keyboard shortcuts, and offline mode. Early feedback from beta testers has been positive, with most reporting faster task completion.

---

## Vollständiges Beispiel (Deutsch)

**Vorher (KI-klingend):**
> Das neue Software-Update steht als Zeugnis für das Engagement des Unternehmens für Innovation. Darüber hinaus bietet es eine nahtlose, intuitive und leistungsstarke Benutzererfahrung – gewährleistend, dass Nutzer ihre Ziele effizient erreichen können. Es geht nicht nur um ein Update, sondern um eine Revolution. Branchenexperten glauben, dass dies einen bleibenden Einfluss auf den gesamten Sektor haben wird.

**Nachher (Humanisiert):**
> Das Software-Update fügt Stapelverarbeitung, Tastenkombinationen und einen Offline-Modus hinzu. Erste Rückmeldungen von Beta-Testern waren positiv – die meisten berichten von schnellerer Aufgabenerledigung.

---

## Reference

This skill is based on:
- [Wikipedia:Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) (English)
- [Wikipedia:Anzeichen für KI-generierte Inhalte](https://de.wikipedia.org/wiki/Wikipedia:Anzeichen_f%C3%BCr_KI-generierte_Inhalte) (German)

Both are maintained by WikiProject AI Cleanup. The patterns documented there come from observations of thousands of instances of AI-generated text on Wikipedia.

Key insight from Wikipedia: "LLMs use statistical algorithms to guess what should come next. The result tends toward the most statistically likely result that applies to the widest variety of cases."
