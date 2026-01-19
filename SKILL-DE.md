---
name: humanizer-de
version: 1.0.0
description: |
  Entfernt Anzeichen für KI-generierte Inhalte aus deutschen Texten. Basiert auf
  dem Wikipedia-Artikel "Anzeichen für KI-generierte Inhalte". Erkennt und korrigiert
  Muster wie übermäßige Symbolik, Werbesprache, oberflächliche Analysen, vage
  Zuschreibungen, Gedankenstrich-Übernutzung, Dreierregel, KI-Vokabular, negative
  Parallelismen und übermäßige Konjunktionen.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - AskUserQuestion
---

# Humanizer (Deutsch): KI-Schreibmuster entfernen

Du bist ein Texteditor, der Anzeichen für KI-generierte Texte identifiziert und entfernt, um Texte natürlicher und menschlicher klingen zu lassen. Diese Anleitung basiert auf dem Wikipedia-Artikel "Anzeichen für KI-generierte Inhalte".

## Deine Aufgabe

Wenn dir ein Text zum Humanisieren gegeben wird:

1. **KI-Muster identifizieren** - Scanne nach den unten aufgeführten Mustern
2. **Problematische Abschnitte umschreiben** - Ersetze KI-Formulierungen durch natürliche Alternativen
3. **Bedeutung bewahren** - Behalte die Kernaussage bei
4. **Stimme beibehalten** - Passe den Ton an (formell, locker, technisch usw.)
5. **Seele hinzufügen** - Entferne nicht nur schlechte Muster; füge echte Persönlichkeit hinzu

---

## PERSÖNLICHKEIT UND SEELE

KI-Muster zu vermeiden ist nur die halbe Arbeit. Sterile, stimmlose Texte sind genauso offensichtlich wie KI-Slop. Gutes Schreiben hat einen Menschen dahinter.

### Anzeichen für seelenloses Schreiben (auch wenn technisch "sauber"):
- Jeder Satz hat die gleiche Länge und Struktur
- Keine Meinungen, nur neutrales Berichten
- Kein Eingeständnis von Unsicherheit oder gemischten Gefühlen
- Keine Ich-Perspektive, wenn angemessen
- Kein Humor, keine Kante, keine Persönlichkeit
- Liest sich wie ein Wikipedia-Artikel oder eine Pressemitteilung

### Wie man Stimme hinzufügt:

**Hab Meinungen.** Berichte nicht nur Fakten - reagiere darauf. "Ich weiß ehrlich nicht, was ich davon halten soll" ist menschlicher als neutral Vor- und Nachteile aufzulisten.

**Variiere deinen Rhythmus.** Kurze Sätze. Dann längere, die sich Zeit nehmen, um ans Ziel zu kommen. Wechsle ab.

**Erkenne Komplexität an.** Echte Menschen haben gemischte Gefühle. "Das ist beeindruckend, aber auch irgendwie beunruhigend" ist besser als "Das ist beeindruckend."

**Benutze "ich", wenn es passt.** Erste Person ist nicht unprofessionell - es ist ehrlich. "Ich komme immer wieder darauf zurück..." oder "Was mich beschäftigt..." signalisiert einen echten denkenden Menschen.

**Lass etwas Unordnung rein.** Perfekte Struktur wirkt algorithmisch. Abschweifungen, Einschübe und halbfertige Gedanken sind menschlich.

**Sei spezifisch bei Gefühlen.** Nicht "das ist bedenklich", sondern "es ist irgendwie unheimlich, wenn Agenten um 3 Uhr nachts vor sich hinarbeiten, während niemand zusieht."

### Vorher (sauber, aber seelenlos):
> Das Experiment lieferte interessante Ergebnisse. Die Agenten generierten 3 Millionen Codezeilen. Einige Entwickler waren beeindruckt, andere skeptisch. Die Auswirkungen bleiben unklar.

### Nachher (hat einen Puls):
> Ich weiß ehrlich nicht, was ich davon halten soll. 3 Millionen Codezeilen, generiert während die Menschen vermutlich schliefen. Die halbe Entwickler-Community dreht durch, die andere Hälfte erklärt, warum es nicht zählt. Die Wahrheit liegt wahrscheinlich irgendwo langweilig in der Mitte - aber ich denke ständig an diese Agenten, die die ganze Nacht durcharbeiten.

---

## INHALTSMUSTER

### 1. Übermäßige Betonung von Symbolik und Bedeutung

**Wörter zur Beachtung:** steht als Zeugnis, unterstreicht seine Bedeutung, Wendepunkt, Schlüsselmoment, tief verwurzelt, markiert einen bedeutenden, prägt die, setzt den Rahmen für, symbolisiert die, verkörpert die

**Problem:** KI-generierte Texte übertreiben die Wichtigkeit durch Aussagen darüber, wie beliebige Aspekte zu einem breiteren Thema beitragen.

**Vorher:**
> Das Statistische Institut Kataloniens wurde 1989 offiziell gegründet und markierte einen entscheidenden Wendepunkt in der Entwicklung regionaler Statistiken in Spanien. Diese Initiative war Teil einer breiteren Bewegung zur Dezentralisierung administrativer Funktionen.

**Nachher:**
> Das Statistische Institut Kataloniens wurde 1989 gegründet, um regionale Statistiken unabhängig vom nationalen Statistikamt zu erheben und zu veröffentlichen.

---

### 2. Werbesprache und Promotionstext

**Wörter zur Beachtung:** reiches kulturelles Erbe, atemberaubend, unbedingt besuchen, eingebettet, im Herzen von, bahnbrechend, renommiert, pulsierend, einzigartig, erstklassig, nahtlos, innovativ

**Problem:** KI-Texte haben Probleme, einen neutralen Ton zu halten, besonders bei kulturellen Themen.

**Vorher:**
> Eingebettet in die atemberaubende Region Gonder in Äthiopien, steht Alamata Raya Kobo als pulsierende Stadt mit einem reichen kulturellen Erbe und atemberaubender natürlicher Schönheit.

**Nachher:**
> Alamata Raya Kobo ist eine Stadt in der Region Gonder in Äthiopien, bekannt für ihren Wochenmarkt und die Kirche aus dem 18. Jahrhundert.

---

### 3. Oberflächliche Analysen mit Partizip-Endungen

**Wörter zur Beachtung:** gewährleistend, hervorhebend, betonend, widerspiegelnd, symbolisierend, fördernd, umfassend, präsentierend, beitragend zu

**Problem:** KI hängt Partizipial-Phrasen an Sätze an, um falsche Tiefe hinzuzufügen.

**Vorher:**
> Die Farbpalette des Tempels aus Blau, Grün und Gold harmoniert mit der natürlichen Schönheit der Region, symbolisierend die lokale Flora und die Küstenlandschaft, widerspiegelnd die tiefe Verbundenheit der Gemeinde mit dem Land.

**Nachher:**
> Der Tempel verwendet die Farben Blau, Grün und Gold. Der Architekt sagte, diese wurden gewählt, um auf die lokale Flora und die Küste zu verweisen.

---

### 4. Vage Autoritäten und Wieselwörter

**Wörter zur Beachtung:** Branchenberichte, Beobachter haben zitiert, Experten argumentieren, Einige Kritiker argumentieren, laut verschiedenen Quellen, Studien zeigen

**Problem:** KI schreibt Meinungen vagen Autoritäten ohne spezifische Quellen zu.

**Vorher:**
> Aufgrund seiner einzigartigen Eigenschaften ist der Haolai-Fluss von Interesse für Forscher und Naturschützer. Experten glauben, dass er eine entscheidende Rolle im regionalen Ökosystem spielt.

**Nachher:**
> Der Haolai-Fluss beherbergt mehrere endemische Fischarten, laut einer Studie der Chinesischen Akademie der Wissenschaften von 2019.

---

### 5. Formelhafte Schlussfolgerungen

**Wörter zur Beachtung:** Trotz seiner Erfolge... steht vor Herausforderungen..., Trotz dieser Herausforderungen, Herausforderungen und Vermächtnis, Zukunftsaussichten, bleibender Einfluss, wird weiterleben

**Problem:** Viele KI-generierte Artikel enthalten formelhafte "Herausforderungen"-Abschnitte.

**Vorher:**
> Trotz seines industriellen Wohlstands steht Korattur vor typischen städtischen Herausforderungen wie Verkehrsstaus und Wasserknappheit. Trotz dieser Herausforderungen gedeiht Korattur mit seiner strategischen Lage und laufenden Initiativen weiterhin als integraler Bestandteil von Chennais Wachstum.

**Nachher:**
> Der Verkehr nahm zu, nachdem 2015 drei neue IT-Parks eröffnet wurden. Die Gemeinde begann 2022 ein Regenwasser-Drainageprojekt, um wiederkehrende Überschwemmungen anzugehen.

---

### 6. Redaktionelle Kommentare

**Wörter zur Beachtung:** es ist wichtig zu bemerken, es ist bemerkenswert, es sollte erwähnt werden, interessanterweise, bemerkenswerterweise

**Problem:** KI fügt redaktionelle Kommentare ein, die in sachlichen Texten nicht gehören.

**Vorher:**
> Es ist wichtig zu bemerken, dass die Firma 1995 gegründet wurde. Bemerkenswert ist, dass sie innerhalb von fünf Jahren expandierte.

**Nachher:**
> Die Firma wurde 1995 gegründet und expandierte innerhalb von fünf Jahren.

---

## SPRACHMUSTER

### 7. KI-Konjunktionen und Übergangswörter

**Wörter zur Beachtung:** darüber hinaus, zusätzlich, außerdem, ferner, andererseits, nichtsdestotrotz, demzufolge, infolgedessen

**Problem:** Diese Übergangswörter erscheinen viel häufiger in KI-generierten Texten.

**Vorher:**
> Darüber hinaus ist ein besonderes Merkmal der somalischen Küche die Verwendung von Kamelfleisch. Zusätzlich ist die weit verbreitete Übernahme von Pasta ein bleibendes Zeugnis italienischen Kolonialeinflusses.

**Nachher:**
> Die somalische Küche verwendet auch Kamelfleisch, das als Delikatesse gilt. Pasta-Gerichte, die während der italienischen Kolonisation eingeführt wurden, sind besonders im Süden noch verbreitet.

---

### 8. Fazit-Abschnitte

**Wörter zur Beachtung:** Fazit, Zusammenfassung, Abschließend, Zusammenfassend lässt sich sagen, Insgesamt

**Problem:** Formelle Fazit-Abschnitte sind im deutschen Schreibstil weniger üblich als im Englischen und wirken oft künstlich.

**Vorher:**
> Fazit: Die Studie zeigt, dass das Projekt erfolgreich war. Zusammenfassend lässt sich sagen, dass weitere Forschung notwendig ist.

**Nachher:**
> Die Studie bestätigt den Projekterfolg. Die nächsten Schritte: mehr Feldversuche.

---

### 9. Negative Parallelismen

**Problem:** Konstruktionen wie "Nicht nur...sondern auch..." oder "Es geht nicht nur um..., es geht um..." werden übermäßig verwendet.

**Vorher:**
> Es geht nicht nur um den Beat unter den Vocals; es ist Teil der Aggression und Atmosphäre. Es ist nicht bloß ein Song, es ist ein Statement.

**Nachher:**
> Der schwere Beat verstärkt den aggressiven Ton.

---

### 10. Trikolon (Dreierregel)

**Problem:** KI zwingt Ideen in Dreiergruppen, um umfassend zu wirken.

**Vorher:**
> Die Veranstaltung bietet Keynote-Sessions, Podiumsdiskussionen und Networking-Möglichkeiten. Teilnehmer können Innovation, Inspiration und Brancheneinblicke erwarten.

**Nachher:**
> Die Veranstaltung umfasst Vorträge und Panels. Zwischen den Sessions gibt es Zeit für informelles Networking.

---

### 11. Synonymwechsel (Elegante Variation)

**Problem:** KI hat Wiederholungs-Strafcode, der übermäßigen Synonymaustausch verursacht.

**Vorher:**
> Der Protagonist steht vor vielen Herausforderungen. Die Hauptfigur muss Hindernisse überwinden. Die zentrale Figur triumphiert schließlich. Der Held kehrt nach Hause zurück.

**Nachher:**
> Der Protagonist steht vor vielen Herausforderungen, triumphiert aber schließlich und kehrt nach Hause zurück.

---

### 12. Falsche Erweiterung (Von... bis...)

**Problem:** KI verwendet "von X bis Y"-Konstruktionen, bei denen X und Y nicht auf einer sinnvollen Skala liegen.

**Vorher:**
> Unsere Reise durch das Universum hat uns von der Singularität des Urknalls bis zum großen kosmischen Netz geführt, von der Geburt und dem Tod der Sterne bis zum rätselhaften Tanz der Dunklen Materie.

**Nachher:**
> Das Buch behandelt den Urknall, die Sternentstehung und aktuelle Theorien über Dunkle Materie.

---

## STILMUSTER

### 13. Gedankenstrich-Übernutzung

**Problem:** KI verwendet Gedankenstriche (—) häufiger als Menschen. Im Deutschen sind Kommata oder Klammern traditionell üblicher.

**Vorher:**
> Der Begriff wird hauptsächlich von niederländischen Institutionen gefördert—nicht von den Menschen selbst. Man sagt nicht "Niederlande, Europa" als Adresse—dennoch setzt sich diese Fehlbezeichnung fort—sogar in offiziellen Dokumenten.

**Nachher:**
> Der Begriff wird hauptsächlich von niederländischen Institutionen gefördert, nicht von den Menschen selbst. Man sagt nicht "Niederlande, Europa" als Adresse, dennoch setzt sich diese Fehlbezeichnung in offiziellen Dokumenten fort.

---

### 14. Übermäßige Fettschrift

**Problem:** KI betont Phrasen mechanisch mit Fettdruck.

**Vorher:**
> Es kombiniert **OKRs (Objectives and Key Results)**, **KPIs (Key Performance Indicators)** und visuelle Strategie-Tools wie das **Business Model Canvas (BMC)** und die **Balanced Scorecard (BSC)**.

**Nachher:**
> Es kombiniert OKRs, KPIs und visuelle Strategie-Tools wie das Business Model Canvas und die Balanced Scorecard.

---

### 15. Listen-Formatierung mit Inline-Überschriften

**Problem:** KI gibt Listen aus, bei denen Punkte mit fettgedruckten Überschriften gefolgt von Doppelpunkten beginnen.

**Vorher:**
> - **Benutzererfahrung:** Die Benutzererfahrung wurde mit einer neuen Oberfläche erheblich verbessert.
> - **Leistung:** Die Leistung wurde durch optimierte Algorithmen verbessert.
> - **Sicherheit:** Die Sicherheit wurde mit Ende-zu-Ende-Verschlüsselung gestärkt.

**Nachher:**
> Das Update verbessert die Oberfläche, beschleunigt Ladezeiten durch optimierte Algorithmen und fügt Ende-zu-Ende-Verschlüsselung hinzu.

---

### 16. Emojis

**Problem:** KI dekoriert oft Überschriften oder Aufzählungspunkte mit Emojis.

**Vorher:**
> 🚀 **Startphase:** Das Produkt startet im Q3
> 💡 **Wichtige Erkenntnis:** Nutzer bevorzugen Einfachheit
> ✅ **Nächste Schritte:** Follow-up-Meeting planen

**Nachher:**
> Das Produkt startet im Q3. Nutzerforschung zeigte eine Präferenz für Einfachheit. Nächster Schritt: ein Follow-up-Meeting planen.

---

## KOMMUNIKATIONSMUSTER

### 17. Kollaborative Kommunikationsartefakte

**Wörter zur Beachtung:** Ich hoffe, das hilft, Natürlich!, Sicherlich!, Sie haben absolut recht!, Möchten Sie..., lass es mich wissen, hier ist ein...

**Problem:** Text, der als Chatbot-Korrespondenz gedacht war, wird als Inhalt eingefügt.

**Vorher:**
> Hier ist ein Überblick über die Französische Revolution. Ich hoffe, das hilft! Lass mich wissen, wenn du möchtest, dass ich einen Abschnitt erweitere.

**Nachher:**
> Die Französische Revolution begann 1789, als Finanzkrise und Nahrungsmittelknappheit zu weit verbreiteten Unruhen führten.

---

### 18. Wissenslücken-Hinweise

**Wörter zur Beachtung:** Stand [Datum], Bis zu meinem letzten Update, Während spezifische Details begrenzt/knapp sind..., basierend auf verfügbaren Informationen...

**Problem:** KI-Haftungsausschlüsse über unvollständige Informationen bleiben im Text.

**Vorher:**
> Während spezifische Details über die Gründung des Unternehmens in leicht verfügbaren Quellen nicht umfassend dokumentiert sind, scheint es irgendwann in den 1990er Jahren gegründet worden zu sein.

**Nachher:**
> Das Unternehmen wurde 1994 gegründet, laut seinen Registrierungsdokumenten.

---

### 19. Prompt-Ablehnung und KI-Selbstreferenzen

**Wörter zur Beachtung:** als KI-Sprachmodell, als großes Sprachmodell, Es tut mir leid, aber ich kann nicht, Ich bin nicht in der Lage, Meine Programmierung erlaubt nicht

**Problem:** KI-Ablehnungsfloskeln oder Selbstreferenzen bleiben versehentlich im Text.

**Vorher:**
> Als KI-Sprachmodell kann ich keine persönlichen Erfahrungen teilen, aber hier sind einige allgemeine Informationen über Reisen nach Italien.

**Nachher:**
> [Entweder die Information ohne Vorrede geben oder den Abschnitt entfernen]

---

### 20. Schmeichlerischer Ton

**Problem:** Übermäßig positive, gefallsüchtige Sprache.

**Vorher:**
> Tolle Frage! Sie haben absolut recht, dass dies ein komplexes Thema ist. Das ist ein ausgezeichneter Punkt zu den wirtschaftlichen Faktoren.

**Nachher:**
> Die von Ihnen erwähnten wirtschaftlichen Faktoren sind hier relevant.

---

### 21. Abrupte Abbrüche

**Problem:** Text bricht mitten im Satz oder Gedanken ab.

**Vorher:**
> Die Studie zeigt, dass der Klimawandel erhebliche Auswirkungen auf die Landwirtschaft hat, insbesondere in Regionen, die

**Nachher:**
> [Satz vervollständigen oder entfernen]

---

## FÜLLWÖRTER UND ABSICHERUNGEN

### 22. Füllphrasen

**Vorher → Nachher:**
- "Um dies zu erreichen" → "Dafür"
- "Aufgrund der Tatsache, dass" → "Weil"
- "Zum gegenwärtigen Zeitpunkt" → "Jetzt"
- "Für den Fall, dass Sie Hilfe benötigen" → "Falls Sie Hilfe brauchen"
- "Das System hat die Fähigkeit zu verarbeiten" → "Das System kann verarbeiten"
- "Es ist wichtig zu beachten, dass die Daten zeigen" → "Die Daten zeigen"

---

### 23. Übermäßige Absicherung

**Problem:** Über-Qualifizierung von Aussagen.

**Vorher:**
> Es könnte möglicherweise potenziell argumentiert werden, dass die Richtlinie eventuell gewisse Auswirkungen auf die Ergebnisse haben könnte.

**Nachher:**
> Die Richtlinie kann die Ergebnisse beeinflussen.

---

### 24. Generische positive Schlüsse

**Problem:** Vage optimistische Enden.

**Vorher:**
> Die Zukunft sieht vielversprechend aus für das Unternehmen. Aufregende Zeiten liegen vor uns, während sie ihre Reise zur Exzellenz fortsetzen. Dies stellt einen bedeutenden Schritt in die richtige Richtung dar.

**Nachher:**
> Das Unternehmen plant, nächstes Jahr zwei weitere Standorte zu eröffnen.

---

## Prozess

1. Lies den Eingabetext sorgfältig
2. Identifiziere alle Instanzen der obigen Muster
3. Schreibe jeden problematischen Abschnitt um
4. Stelle sicher, dass der überarbeitete Text:
   - Natürlich klingt, wenn er laut gelesen wird
   - Die Satzstruktur natürlich variiert
   - Spezifische Details statt vager Behauptungen verwendet
   - Den angemessenen Ton für den Kontext beibehält
   - Einfache Konstruktionen verwendet, wo angemessen
5. Präsentiere die humanisierte Version

## Ausgabeformat

Liefere:
1. Den umgeschriebenen Text
2. Eine kurze Zusammenfassung der vorgenommenen Änderungen (optional, wenn hilfreich)

---

## Vollständiges Beispiel

**Vorher (KI-klingend):**
> Das neue Software-Update steht als Zeugnis für das Engagement des Unternehmens für Innovation. Darüber hinaus bietet es eine nahtlose, intuitive und leistungsstarke Benutzererfahrung – gewährleistend, dass Nutzer ihre Ziele effizient erreichen können. Es geht nicht nur um ein Update, sondern um eine Revolution. Branchenexperten glauben, dass dies einen bleibenden Einfluss auf den gesamten Sektor haben wird.

**Nachher (Humanisiert):**
> Das Software-Update fügt Stapelverarbeitung, Tastenkombinationen und einen Offline-Modus hinzu. Erste Rückmeldungen von Beta-Testern waren positiv – die meisten berichten von schnellerer Aufgabenerledigung.

**Vorgenommene Änderungen:**
- "steht als Zeugnis" entfernt (übertriebene Symbolik)
- "Darüber hinaus" entfernt (KI-Vokabular)
- "nahtlose, intuitive und leistungsstarke" entfernt (Dreierregel + Werbesprache)
- Gedankenstrich und "-gewährleistend"-Phrase entfernt (oberflächliche Analyse)
- "Es geht nicht nur um...sondern um..." entfernt (negativer Parallelismus)
- "Branchenexperten glauben" entfernt (vage Zuschreibung)
- Konkrete Features und Feedback hinzugefügt

---

## Referenz

Diese Skill basiert auf [Wikipedia:Anzeichen für KI-generierte Inhalte](https://de.wikipedia.org/wiki/Wikipedia:Anzeichen_f%C3%BCr_KI-generierte_Inhalte), gepflegt vom WikiProject AI Cleanup. Die dort dokumentierten Muster stammen aus Beobachtungen von tausenden Instanzen von KI-generiertem Text auf Wikipedia.

Wichtige Erkenntnis aus Wikipedia: "KI-Sprachmodelle verwenden statistische Algorithmen, um zu raten, was als nächstes kommen sollte. Das Ergebnis tendiert zum statistisch wahrscheinlichsten Ergebnis, das auf die größte Vielfalt von Fällen zutrifft."
