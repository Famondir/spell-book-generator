## ADDED Requirements

### Requirement: Kapitel
Bei aktivierter Einstellung „Kapitel“ (Standard) SHALL jeder Abschnitt (Zaubertricks, Alltagszauber, jeder Grad) mit einer Doppelseite beginnen: links Kapiteltitel, Ordnungsfigur und Text zur Stufe, rechts die Formeln des Kapitels mit deutschem Titel, Regelnamen und Seitenzahl, bei langen Kapiteln über mehrere Seiten fortgesetzt. Die Kapiteldoppelseite MUST links beginnen; dazu SHALL am Ende des vorherigen Kapitels bei Bedarf eine Leerseite stehen.

#### Scenario: Kapitel III
- **WENN** das Buch Zauber des 3. Grades enthält
- **DANN** steht vor dem ersten von ihnen eine Doppelseite „Zauber des III. Grades“ mit Liste aller Formeln dieses Grades

### Requirement: Ausgleich für linke Seiten
Die Einstellung für mehrseitige Zauber SHALL drei Modi bieten: Notizseite einfügen, Umfang des nächsthöheren Grades, aus. Im Modus „nächsthöherer Grad“ MUST statt einer Notizseite der vorangehende Zauber mit ungerader Seitenzahl den Seitenaufbau des nächsthöheren Grades bekommen, wo das möglich ist.

#### Scenario: Zwei Grad-3-Zauber
- **WENN** zwei Grad-3-Zauber aufeinander folgen und der Modus „nächsthöherer Grad“ gewählt ist
- **DANN** belegt der erste vier Seiten mit dem Aufbau eines Grad-4-Zaubers, und der zweite beginnt links ohne Notizseite

### Requirement: Regeltext-Knopf oben links
Das (i) der Vorschau SHALL oben links auf der ersten Zauberseite sitzen.

#### Scenario: Mit QR-Code
- **WENN** QR-Codes eingeschaltet sind
- **DANN** liegt das (i) in der Vorschau über dem QR-Code; im Druck erscheint nur der QR-Code
