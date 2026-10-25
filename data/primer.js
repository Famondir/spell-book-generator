// Lehrheft („Fibel der Kreise“): Lehrplan und geschriebene Texte, setting-neutral.
// Lektionen mit gen: werden in app/js/primer.js aus den Daten der App ergänzt (Glyphen, Kreise, Buch, Formulare).
// box: { title, text: [...] } setzt einen Weltinfo-Kasten nach dem Lesestück.
// pageEach: im ausgewogenen Satz beginnt jede Lektion dieses Teils auf einer neuen Seite.
// taskFirst: "Verweis" stellt die Aufgabe vor den erzeugten Stoff (z. B. vor die Kreise) mit diesem Hinweis.
// Im Lesestück markiert [[Begriff]] einen hervorgehobenen Begriff; seine Erklärung steht in glosses
// und erscheint am Rand und im Glossar.
window.PRIMER = {
  title: "Fibel der Kreise",
  subtitle: "Erstes Lehrheft",
  parts: [
    { id: "V", title: "Vorspann", pageEach: true },
    { id: "I", title: "Die Werkstatt", pageEach: true },
    { id: "II", title: "Hand und Kreis" },
    { id: "III", title: "Die Glyphen" },
    { id: "IV", title: "Die Zeichen der Stoffe" },
    { id: "V2", title: "Schnellglyphen", roman: "V" },
    { id: "VI", title: "Kreise lesen" },
    { id: "VII", title: "Kleine Formeln" },
    { id: "VIII", title: "Das Gesellenstück" },
    { id: "A", title: "Anhang" },
  ],
  // Randkästen je Teil (neutral; das Profil kann eigene setzen)
  boxes: {
    I: { praise: "„Die Feder schreibt, als hätte sie nie etwas anderes getan.“", fear: "Die Tinte, die über Nacht im offenen Fass geschimmelt ist.", saying: "Wer sein Messer schont, schont seine Federn nicht." },
    II: { praise: "„Der Kreis schließt sich, ohne dass man den Anfang findet.“", fear: "Die Prüfscheibe am Montagmorgen.", saying: "Erst die Hand, dann die Kraft." },
    III: { praise: "„Das Zeichen ist so ruhig wie ein gesetzter Stein.“", fear: "Ein Beizeichen vergessen und es erst beim Wirken merken.", saying: "Der Kern bestimmt, das Beizeichen bittet." },
    IV: { praise: "„Du liest den Stoff, bevor du ihn riechst.“", fear: "Saturn und Jupiter verwechseln, vor dem ganzen Haus.", saying: "Kein Ding ohne Preis, kein Preis ohne Zeichen." },
    V2: { praise: "„Fünf Striche, und man weiß, was kommt.“", fear: "Der Zeitdrill bei herunterbrennender Kerze, wenn der Meister zusieht.", saying: "Den Kern kürzt man nicht." },
    VI: { praise: "„Du hast den Kreis gelesen wie einen Brief.“", fear: "Ein Lückenkreis, in dem nichts zu fehlen scheint.", saying: "Außen die Welt, innen die Sache." },
    VII: { praise: "„Du hast die Formel nicht gesprochen, du hast sie gewusst.“", fear: "Die Formel vor Zeugen vergessen.", saying: "Dreimal ist einmal." },
    VIII: { praise: "„Das ist deine Seite. Man sieht es.“", fear: "Der erste Strich im Reinbuch.", saying: "Was im Reinbuch steht, steht." },
  },
  lessons: [
    // --- Vorspann ---------------------------------------------------------------
    {
      id: "v-use", part: "V", title: "Wie dieses Heft zu gebrauchen ist", unnumbered: true,
      read: [
        "Dieses Heft ist kein Zauberbuch. Es enthält keine Formel, die du wirken könntest, wenn du es aufschlägst. Es enthält, was eine Hand und ein Kopf lernen müssen, bevor ein Zauberbuch ihnen etwas nützt.",
        "Jede Lektion beginnt mit einem Lesestück. Lies es zweimal: einmal für den Sinn, einmal für die Wörter. Neue Begriffe stehen in roter Tinte; was sie bedeuten, steht am Rand, und am Ende des Heftes findest du sie alle im [[Glossar]] wieder.",
        "Wo eine Figur gezeigt wird, ist es eine [[Ansicht des Meisters]]: klein, damit du sie nicht nachfährst. Formeln und Zeichen werden nicht abgepaust, sondern abgezeichnet, erst mit dem Auge, dann mit der Hand, zuletzt aus dem Gedächtnis.",
        "Geübt wird nicht in diesem Heft. Dafür hast du die [[Wachstafel]], deren Fehler man glattstreicht, und Abfallpapier aus der Werkstatt. Ins Heft kommt nur, was der Meister geprüft hat: sein Vermerk unter jeder Aufgabe.",
        "Später führst du ein [[Reinbuch]]. Was dort steht, steht für immer. Darum lernst du hier.",
      ],
      glosses: {
        Glossar: "Verzeichnis aller roten Begriffe dieses Heftes mit der Lektion, in der sie zuerst vorkommen (Anhang E).",
        "Ansicht des Meisters": "Verkleinertes Muster zum Anschauen. Nicht nachfahren – abzeichnen.",
        Wachstafel: "Holzbrett mit eingelassenem Wachs. Mit der Spitze des Griffels schreibt man, mit dem flachen Ende streicht man glatt.",
        Reinbuch: "Das eigene Zauberbuch. Im Gegensatz zum Arbeitsheft wird darin nicht geübt.",
      },
    },
    {
      id: "v-preface", part: "V", title: "Vorrede des Meisters", unnumbered: true, gen: "signature",
      read: [
        "Du hältst dein erstes Lehrheft in der Hand, und vermutlich hast du gehofft, es stünde mehr Zauberei darin. Es steht keine darin. Es steht darin, wie man eine Feder schneidet, wie man Tinte ansetzt, wie man einen Kreis zieht, der hält. Das ist enttäuschend, und es ist richtig so.",
        "Ich habe Lehrlinge gehabt, die nach drei Wochen eine Kerze entzünden konnten und nach drei Jahren immer noch keinen geschlossenen Kreis. Sie wirken heute, wenn sie Glück haben, die Zauber anderer Leute aus fremden Büchern, und sie wissen nie genau, warum etwas gelingt. Ich habe andere gehabt, die ein ganzes Jahr nur gezeichnet haben. Die schreiben heute ihre eigenen Formeln.",
        "Ich werde dir nichts zum Nachfahren geben. Ich zeige dir, wie etwas aussieht, und dann zeichnest du es, wieder und wieder, bis deine Hand es kann, ohne dass dein Kopf ihr hilft. Ich prüfe, was du zeichnest, mit dem Auge und mit der Scheibe, und ich sage dir, was falsch ist. Ich sage es nicht, um dich zu kränken, sondern weil ein Fehler, den ich jetzt nicht sehe, später in deinem Buch steht.",
        "Was ich von dir verlange: Geduld, saubere Hände und Ehrlichkeit über deine Fehler. Was du von mir verlangen kannst: dass ich dir alles zeige, was ich weiß, sobald du es tragen kannst. Mehr steht auch im Vertrag nicht.",
      ],
    },
    {
      id: "v-contract", part: "V", title: "Lehrvertrag", unnumbered: true, gen: "contract",
      read: ["Der Vertrag wird am ersten Tag in zwei gleichen Abschriften geschlossen: eine für den Meister, eine für den Lehrling. Gelesen wird er laut und vor einem Zeugen, der weder mit dem einen noch mit dem anderen verwandt ist."],
    },
    {
      id: "v-house", part: "V", title: "Hausordnung und Tagesplan", unnumbered: true, gen: "schedule",
      read: [
        "Das Haus hat keine Uhr, es hat eine Glocke. Wer die Glocke überhört, hat sie überhört; Entschuldigungen gibt es für Krankheit und Feuer, nicht für Schlaf.",
        "Erstens: Die Werkstatt betritt man mit sauberen Händen und verlässt sie mit sauberem Tisch. Zweitens: Kein Licht ohne Aufsicht, keine Flamme neben Papier. Drittens: Was in den Schubladen des Meisters liegt, bleibt dort, auch wenn die Schublade offen steht. Viertens: Nichts kommt in den Mund, was in der Werkstatt war, auch nicht die Pinselspitze. Fünftens: In der stillen Stunde wird nicht gesprochen, nicht geklopft und nicht gefragt. Sechstens: Wer etwas zerbricht, sagt es, bevor man es findet.",
        "Verstöße bringen [[Strafarbeit]]: Wasser tragen, Asche fegen, Lumpen sortieren, Ruß abkratzen. Zehn Strafarbeiten im Jahr, und der Vertrag wird überdacht.",
      ],
      glosses: { Strafarbeit: "Niedere Arbeit im Haus statt freier Zeit. Nicht als Rache gemeint, sondern als Gelegenheit zum Nachdenken." },
    },
    {
      id: "v-kit", part: "V", title: "Die Ausrüstung der Lehrlingskammer", unnumbered: true, gen: "kit",
      read: ["Was hier steht, bekommt der Lehrling am ersten Tag oder macht es in den ersten Wochen selbst. Was verloren geht, wird ersetzt, aber nicht zweimal. Abgehakt wird, wenn das Stück da ist und der Lehrling es benutzen kann."],
    },

    // --- I. Die Werkstatt --------------------------------------------------------
    {
      id: "l1", part: "I", title: "Die Wachstafel",
      read: [
        "Die erste Unterlage jedes Lehrlings ist keine Seite, sondern die [[Wachstafel]]: ein Brett mit einem erhabenen Rand, in das dunkel gefärbtes Wachs gegossen ist. Man schreibt mit dem [[Griffel]], dessen Spitze eine helle Linie ins Wachs zieht. Das flache Ende streicht sie wieder glatt.",
        "Das Wachs verzeiht alles, und genau darum fängt man hier an. Ein misslungener Kreis kostet auf der Tafel nichts als einen Strich mit dem Daumen. Auf Pergament kostet er eine Seite, im Reinbuch eine Formel.",
        "Die Tafel will gepflegt sein. Im Sommer wird das Wachs weich und schmiert; man legt sie dann in den Keller. Im Winter wird es spröde und splittert unter dem Griffel; man wärmt sie kurz in der Hand oder am Ofen, nie über der Flamme. Ist die Fläche nach vielen Wochen zerfurcht, wird das Wachs vorsichtig angeschmolzen und neu glattgezogen.",
      ],
      glosses: {
        Griffel: "Stift aus Knochen, Metall oder hartem Holz. Spitze zum Schreiben, flaches Ende zum Glätten.",
      },
      task: ["Glätte deine Tafel vollständig, sodass keine Linie mehr zu sehen ist.", "Ziehe zwanzig gerade Linien, glätte, ziehe zwanzig Bögen, glätte.", "Zeige dem Meister die geglättete Tafel: Er prüft mit dem Fingernagel, ob die Fläche eben ist."],
      check: ["Glätte", "Linie"],
    },
    {
      id: "l2", part: "I", title: "Der Federkiel",
      read: [
        "Geschrieben wird mit Federn aus dem Flügel großer Vögel: Gans für den Alltag, Schwan für kräftige Striche, Rabe oder Krähe für die feinsten Linien. Genommen werden nur die äußeren Schwungfedern. Wer mit der rechten Hand schreibt, sucht Federn des linken Flügels, denn sie krümmen sich von der Hand weg.",
        "Eine frische Feder ist weich und zäh. Sie wird zuerst gewässert, damit sie biegsam wird, und dann gehärtet: Man steckt den Kiel kurz in heißen Sand, bis die trübe Haut klar wird. Dieses [[Holländern]] macht ihn hart und federnd. Zu heiß, und er splittert; zu kurz, und er bleibt schwammig.",
        "Geschnitten wird mit dem [[Federmesser]]: ein langer schräger Schnitt auf der Unterseite, ein kurzer [[Spalt]] in der Mitte der Spitze, dann die Schultern, zuletzt die Spitze selbst, glatt auf einer harten Unterlage abgetrennt. Eine Feder hält nur einige Seiten; wer schreibt, schneidet nach. Ein stumpfes Messer quetscht den Kiel, statt ihn zu schneiden. Darum ist das Federmesser das Werkzeug, das der Lehrling am besten pflegt.",
      ],
      glosses: {
        Holländern: "Härten des Federkiels in heißem Sand oder über einem heißen Eisen.",
        Federmesser: "Kleines, sehr scharfes Messer zum Zurichten und Nachschneiden der Federn.",
        Spalt: "Kurzer Schlitz in der Federspitze. Er hält und verteilt die Tinte.",
      },
      task: ["Richte drei Federn zu: wässern, härten, schneiden.", "Schreibe mit jeder zehn Probestriche und notiere daneben, was an der Feder nicht stimmt (spritzt, kratzt, läuft trocken).", "Schneide die schlechteste nach, bis sie gleichmäßig schreibt."],
      check: ["Schnitt", "Spalt", "Strich"],
    },
    {
      id: "l3", part: "I", title: "Rußtinte und Tusche",
      read: [
        "Die erste Tinte des Lehrlings ist die [[Rußtinte]]. Man hält eine kalte Tonschale über eine rußende Öllampe, kratzt den Ruß ab und verreibt ihn mit etwas Gummi und Wasser, bis die Masse glatt ist. In fester Form, mit Leim zu Stäben gepresst und am Reibstein angerieben, heißt sie [[Tusche]].",
        "Rußtinte ist sofort tiefschwarz, sie ist nicht sauer und frisst nichts an. Dafür liegt sie nur auf der Oberfläche: Mit einem feuchten Schwamm oder einem scharfen Messer ist sie wieder fort. Für Übungsblätter ist das ein Vorzug, für ein Zauberbuch ein Fehler, denn eine Formel, die man abwaschen kann, kann auch jemand anders abwaschen.",
        "Zu wenig Bindemittel, und der Strich wird körnig und grau; zu viel, und er glänzt und platzt beim Trocknen ab. Den richtigen Punkt findet man nicht im Rezept, sondern mit Probestrichen.",
      ],
      glosses: {
        Rußtinte: "Tinte aus Lampenruß und Bindemittel. Schwarz, mild, aber abwaschbar.",
        Tusche: "Rußtinte in fester Form, am Reibstein mit Wasser angerieben.",
      },
      task: ["Reibe drei Schälchen Rußtinte an: mit wenig, mittel und viel Gummi.", "Ziehe mit jeder fünf Striche und lass sie trocknen.", "Streiche mit dem feuchten Finger über jeden Strich und notiere, welcher hält."],
      check: ["Schwärze", "Haftung"],
    },
    {
      id: "l4", part: "I", title: "Eisengallustinte",
      read: [
        "Die [[Eisengallustinte]] ist die Tinte der Bücher, die bleiben sollen. Sie entsteht aus vier Dingen. Die [[Galläpfel]] sind harte Kugeln, die eine Wespe an Eichenblättern wachsen lässt; das [[Vitriol]] ist ein grünes Salz des Eisens; dazu kommen Gummi aus Akazienharz als Bindemittel und Regenwasser, Wein oder Essig.",
        "Erstens werden die Galläpfel grob zerstoßen, nicht zu Staub. Zweitens werden sie in der Flüssigkeit ausgelaugt, über Tage in der Sonne oder kürzer auf kleinem Feuer. Drittens wird die Brühe durch ein Leinentuch geseiht. Viertens kommt das Vitriol hinein, nach und nach: Die Brühe wird sofort grau und dunkelt beim Trocknen zu Schwarz nach. Fünftens das Gummi, bis die Tinte wie dünnes Öl von der Feder läuft. Sechstens ruht sie einige Tage und wird täglich umgerührt.",
        "Diese Tinte frisst sich in die Seite. Darum hält sie, und darum ist sie gefährlich: Mit zu viel Vitriol wird sie braun und frisst nach Jahren Löcher, wo sie stand. Diesen [[Tintenfraß]] sieht man an alten Büchern, deren Buchstaben wie ausgestanzt sind. Ein Zauberbuch mit zu scharfer Tinte zerfällt von innen.",
      ],
      glosses: {
        Eisengallustinte: "Dauerhafte schwarze Tinte aus Galläpfeln, Vitriol, Gummi und Flüssigkeit. Zieht in die Seite ein.",
        Galläpfel: "Kugelige Wucherungen an Eichen. Liefern den Gerbstoff der Tinte.",
        Vitriol: "Grünes Eisensalz. Macht die Tinte schwarz; reizt Haut und Augen.",
        Tintenfraß: "Zerstörung der Seite durch zu saure, zu eisenreiche Tinte.",
      },
      box: { title: "Was ist hier schiefgelaufen?", text: ["Blass und grau statt schwarz: zu wenig Vitriol oder zu kurz ausgelaugt. Schimmel und fauliger Geruch: Wasser ohne Wein oder Essig, offenes Gefäß. Ausfransen: zu wenig Gummi oder ungeleimtes Papier. Glanz und Schuppen: zu viel Gummi. Krümel in der Feder: nicht geseiht. Und immer: Vitriol nicht mit bloßen Händen, nicht im Küchentopf, Dämpfe nicht einatmen."] },
      task: ["Setze unter Aufsicht eine kleine Menge Tinte an und führe zwei Wochen lang ein Tintentagebuch: Tag, Farbe der Brühe, Geruch, Probestrich.", "Vergleiche am Ende einen Probestrich vom dritten mit einem vom vierzehnten Tag."],
      check: ["Sorgfalt", "Tagebuch", "Ergebnis"],
    },
    {
      id: "l5", part: "I", title: "Farben und ihre Gifte",
      read: [
        "Nicht alles im Kreis steht in Schwarz. Was gefährlich ist, was auslöst, was zuerst gelesen werden muss, steht in Rot: die [[Rubrik]]. In diesem Heft sind es die neuen Begriffe, in deinem Buch werden es die Schwellentore und die Hauptessenz sein.",
        "Das schönste Rot ist [[Zinnober]], aus Quecksilber und Schwefel. Daneben gibt es Mennige, ein Orangerot aus Blei; Bleiweiß; Grünspan, das von Kupfer abgekratzt wird, das über Essig hing; und ein leuchtendes Gelb, das Arsen enthält. Wer die Zeichen der Stoffe kennt, sieht schon: Es sind dieselben Stoffe, die in den Formeln als Preis stehen. Merkur, Saturn, Venus. Farbe ist Alchemie.",
        "Harmlose Farben gibt es auch: Rötel aus Erde, Gelb aus Safran oder Wau, Blau aus Waid, Braun aus Walnussschalen. Sie leuchten weniger, aber sie töten niemanden. Für Übungsblätter genügen sie.",
      ],
      glosses: {
        Rubrik: "Rote Schrift für das, was zuerst gelesen werden muss. Von lateinisch ruber, rot.",
        Zinnober: "Leuchtend rote Farbe aus Quecksilber und Schwefel. Giftig.",
      },
      box: { title: "Das Gift im Tintenfass", text: [
        "Die giftigen Farben werden in diesem Haus nicht vom Lehrling angerieben. Sie stehen im verschlossenen Schrank des Meisters, und wer sie benutzt, tut es mit einem eigenen Pinsel, den er nie in den Mund nimmt, nie an den Lippen spitzt und nach der Arbeit auswäscht.",
        "Ein Lehrling, der einen Pinsel ableckt, um die Spitze zu formen, tut es mit Zinnober genau einmal zu oft, und er merkt es erst Jahre später: am Zittern der Hand. Für einen Zeichner gibt es kein schlimmeres Ende.",
      ] },
      task: ["Mische aus Rötel, Safran und Waid drei harmlose Übungsfarben.", "Zeichne mit jeder einen Kreis und schreibe den Namen der Farbe in Schwarz darunter.", "Nenne dem Meister zu Zinnober, Mennige und Grünspan den Stoff, aus dem sie bestehen, und sein Zeichen."],
      check: ["Mischung", "Wissen"],
    },
    {
      id: "l6", part: "I", title: "Pergament",
      read: [
        "[[Pergament]] ist Haut, die nicht gegerbt, sondern unter Spannung getrocknet wird. Die Haut eines Kalbs, Schafs oder einer Ziege liegt einige Wochen in Kalkwasser, bis sich die Haare lösen. Dann wird sie auf einem gewölbten Baum mit stumpfem Messer gesäubert und nass in einen Rahmen geschnürt, die [[Herse]].",
        "In der Herse wird die Haut geschabt, angefeuchtet, getrocknet und nachgespannt, wieder und wieder, mit einem halbmondförmigen Messer. Erst dabei wird aus Haut Pergament: dünn, fest, hell. Zuletzt wird sie mit Bimsstein geschliffen und mit Kreide eingerieben, damit die Tinte nicht perlt.",
        "Pergament hat zwei Seiten. Die [[Haarseite]] ist gelblicher und gesprenkelt, die Fleischseite weißer und glatter. Glyphen zeichnet man auf die Fleischseite, denn die Haarseite trinkt die Tinte ungleich. Für ein großes Zauberbuch braucht es die Häute einer ganzen kleinen Herde. Darum übt niemand auf Pergament.",
      ],
      glosses: {
        Pergament: "Ungegerbte, unter Spannung getrocknete und geschabte Tierhaut. Träger des Reinbuchs.",
        Herse: "Holzrahmen, in den die nasse Haut geschnürt und nachgespannt wird.",
        Haarseite: "Die äußere Seite des Pergaments, gelblich und gesprenkelt. Die innere heißt Fleischseite.",
      },
      task: ["Lass dir vom Meister ein Stück Pergament geben und bestimme Haar- und Fleischseite, ohne zu fragen.", "Ziehe auf beiden Seiten mit Eisengallustinte je einen Kreis und vergleiche den Strich unter der Lupe."],
      check: ["Erkennen", "Vergleich"],
    },
    {
      id: "l7", part: "I", title: "Papier schöpfen",
      read: [
        "Papier ist billiger als Pergament und für alles gut, was nicht ewig halten muss: Übungsblätter, Briefe, Schriftrollen. Es wird aus Lumpen gemacht. Leinen und Hanf werden sortiert, zerschnitten, wochenlang feucht gelagert, bis sie faulen, und dann zu einem Faserbrei gestampft.",
        "Der Brei schwimmt in warmem Wasser in der [[Bütte]]. Der Schöpfer taucht die [[Schöpfform]] ein, einen Rahmen mit Drahtsieb, hebt sie waagrecht heraus und schüttelt kurz, damit sich die Fasern verfilzen. Der nasse Bogen wird auf einen Filz gestürzt, das [[Gautschen]], gepresst und auf Seilen getrocknet.",
        "Ungeleimtes Papier saugt wie ein Schwamm; die Tinte läuft. Darum wird jeder Bogen in heißen Leim aus Hautabfällen getaucht und noch einmal gepresst. Auf manchem Sieb ist eine Figur aus Draht festgenäht. Dort wird das Papier dünner, und hält man den Bogen gegen das Licht, sieht man das [[Wasserzeichen]] der Mühle.",
      ],
      glosses: {
        Bütte: "Bottich mit warmem Wasser und Faserbrei.",
        Schöpfform: "Rahmen mit Drahtsieb, mit dem der Bogen aus der Bütte gehoben wird.",
        Gautschen: "Abstürzen des nassen Bogens von der Form auf einen Filz.",
        Wasserzeichen: "Im Gegenlicht sichtbares Zeichen der Papiermühle, entstanden durch eine Drahtfigur im Sieb.",
      },
      task: ["Schöpfe unter Anleitung fünf Bögen und trockne sie.", "Halte sie gegen das Licht: Welcher ist wolkig, welcher gleichmäßig? Notiere, warum.", "Ziehe auf einem geleimten und einem ungeleimten Bogen je einen Strich mit derselben Feder."],
      check: ["Gleichmaß", "Begründung"],
    },
    {
      id: "l8", part: "I", title: "Zirkel, Lineal und Schnur", gen: "pageSetup",
      read: [
        "Bevor auf einer Seite ein Strich steht, wird sie eingerichtet. Mit einer Ahle oder einem Rädchen sticht man am Rand kleine Löcher durch alle Blätter einer Lage, das [[Stechen]]. Zwischen den Löchern zieht man mit Lineal und Griffel feine Linien: das [[Linieren]]. Zuerst blind, als Rille ohne Farbe; später mit dem Bleistift.",
        "Der Zirkel teilt und überträgt. Mit ihm greift man einen Abstand ab und setzt ihn an anderer Stelle wieder ein, man halbiert, man teilt einen Kreis. Ein Zirkel mit lockerem Gelenk ist schlimmer als keiner.",
        "Für große Kreise am Boden nimmt man Pflock und Schnur. Und für den rechten Winkel, wenn kein Winkeleisen da ist, die [[Zwölfknotenschnur]]: zwölf gleiche Abstände, zum Dreieck aus drei, vier und fünf Teilen gelegt. Der Winkel zwischen den kurzen Seiten ist recht, und das schon seit Menschen Häuser bauen.",
      ],
      glosses: {
        Stechen: "Markierung der Linien durch kleine Löcher am Rand, durch die ganze Lage gestochen.",
        Linieren: "Ziehen der Hilfslinien zwischen den Stichlöchern, zuerst blind, später mit Blei.",
        Zwölfknotenschnur: "Schnur mit zwölf gleichen Abständen. Als Dreieck 3–4–5 gelegt, ergibt sie einen rechten Winkel.",
      },
      task: ["Richte eine Übungsseite ein: stechen, linieren, Rand frei lassen.", "Knote eine Zwölfknotenschnur und lege damit einen rechten Winkel auf dem Boden der Werkstatt.", "Prüfe ihn mit dem Winkeleisen des Meisters."],
      check: ["Einrichtung", "Winkel"],
    },
    {
      id: "l9", part: "I", title: "Zauberkreide und Kreise am Boden", gen: "groundCircle",
      read: [
        "Nicht jeder Kreis passt auf eine Seite. Rituale und Schutzkreise werden auf den Boden gezeichnet, mit [[Zauberkreide]], Kohle, gestreutem Salz oder Mehl. Die Kreide ist gewöhnliche Kreide, in die beim Formen etwas gemischt wird, das zur Formel passt, und die vor allem trocken und sauber sein muss. Feuchte Kreide schmiert, und ein verschmierter Kreis ist ein offener Kreis.",
        "Gezogen wird mit Pflock und Schnur. Der häufigste Fehler: Die Schnur wickelt sich beim Gehen um den Pflock, wird kürzer, und aus dem Kreis wird eine [[Spirale]], deren Ende den Anfang nicht trifft. Abhilfe: Statt einer Schlaufe einen losen Ring um den Pflock legen, und die Schnur immer straff halten.",
        "Wer einen Bodenkreis zieht, beginnt und endet im Norden und tritt danach nicht mehr über die Linie. Schuhe sind dabei ein größeres Risiko als Dämonen.",
      ],
      glosses: {
        Zauberkreide: "Kreide für Bodenkreise, sauber, trocken, oft mit einem Zusatz, der zur Formel passt.",
        Spirale: "Häufigster Fehler beim Bodenkreis: Die Schnur wickelt sich auf, der Kreis schließt nicht.",
      },
      task: ["Ziehe im Hof mit Pflock, Schnur und Kreide einen Kreis von drei Schritt Durchmesser.", "Lass den Meister mit einem Maßstab an acht Stellen den Abstand zum Pflock messen.", "Wiederhole mit Ring statt Schlaufe und vergleiche."],
      check: ["Rundheit", "Schluss"],
    },

    // --- II. Hand und Kreis -------------------------------------------------------
    {
      id: "l10", part: "II", title: "Haltung, Atem, Federprobe",
      read: [
        "Gezeichnet wird nicht mit den Fingern, sondern mit dem ganzen Arm. Die Finger halten die Feder, locker, wie man einen kleinen Vogel hält. Das Handgelenk liegt nicht fest auf, es gleitet. Die Bewegung kommt aus dem Ellbogen und der Schulter. Wer aus den Fingern zeichnet, zeichnet kleine, verkrampfte Kreise und hat nach einer Stunde einen Krampf.",
        "Vor jedem Kreis ein Atemzug: einatmen, die Feder ansetzen, ausatmend ziehen. Die Linie folgt dem Atem; wer den Atem anhält, zittert. Das ist keine Mystik, das ist Muskel.",
        "Jede neu geschnittene Feder wird erst auf einem Abfallblatt geprüft, mit Strichen, Schlingen, einem Kreis. Diese [[Federprobe]] steht auf vielen alten Seiten am Rand. Du darfst sie in diesem Heft auf die leeren Ränder setzen, aber nur dort.",
      ],
      glosses: { Federprobe: "Probestriche mit einer frisch geschnittenen Feder, meist am Rand oder auf Abfallblättern." },
      task: ["Setze dich an das Pult, wie der Meister es zeigt, und ziehe zehn große Bögen nur aus der Schulter, die Hand schwebend.", "Ziehe zehn Kreise, jeden mit einem Atemzug.", "Mache auf dem Rand dieser Seite eine Federprobe."],
      check: ["Haltung", "Atem", "Lockerheit"],
    },
    {
      id: "l11", part: "II", title: "Die Grundstriche", gen: "strokes",
      read: [
        "Alle Glyphen, auch die verwickeltsten, bestehen aus fünf Strichen. Diese [[Grundstriche]] sind die Senkrechte, die Waagerechte, der Bogen, der Haken und die Öse. Wer diese fünf beherrscht, muss keine Glyphe auswendig zeichnen; er setzt sie zusammen.",
        "Jeder Strich hat seine Richtung. Senkrechte werden von oben nach unten gezogen, Waagerechte von links nach rechts, Bögen im Uhrzeigersinn, wenn nichts anderes gesagt ist. Die Richtung heißt der [[Duktus]]. Eine Glyphe, die im falschen Duktus gezeichnet ist, sieht oft richtig aus und wirkt trotzdem falsch, denn die Kraft folgt dem Strich, nicht dem Bild.",
      ],
      glosses: {
        Grundstriche: "Senkrechte, Waagerechte, Bogen, Haken und Öse. Aus ihnen sind alle Glyphen gebaut.",
        Duktus: "Richtung und Reihenfolge, in der die Striche einer Glyphe gezogen werden.",
      },
      task: ["Ziehe jeden Grundstrich zwanzigmal auf der Wachstafel, im richtigen Duktus.", "Lass den Meister zusehen: Er achtet nicht auf das Ergebnis, sondern auf die Richtung."],
      check: ["Form", "Duktus"],
    },
    {
      id: "l12", part: "II", title: "Die Gerade ohne Lineal",
      read: [
        "Eine Gerade aus freier Hand gelingt nicht, indem man auf die Feder schaut, sondern indem man auf das Ziel schaut. Setze zwei Punkte. Lege die Feder auf den ersten, richte den Blick auf den zweiten und ziehe zügig, ohne anzuhalten. Langsame Linien zittern; schnelle Linien sind gerade oder krumm, aber nie zittrig, und krumm wird mit Übung gerade.",
        "Lange Geraden zieht man nicht aus dem Handgelenk, sondern mit dem ganzen Arm, und vor dem Strich führt man die Bewegung zweimal in der Luft aus, ohne aufzusetzen. Dieses [[Anschwingen]] ist erlaubt und wird nie verlernt.",
      ],
      glosses: { Anschwingen: "Die Bewegung eines Strichs vor dem Aufsetzen in der Luft ausführen." },
      task: ["Setze zwanzig Punktpaare in verschiedenen Abständen und Richtungen und verbinde sie frei.", "Lege dann das Lineal an jede Linie: Wo weicht sie mehr als eine Federbreite ab?", "Wiederhole, bis höchstens zwei von zwanzig abweichen."],
      check: ["Gerade", "Treffer", "Tempo"],
    },
    {
      id: "l13", part: "II", title: "Die hundert Kreise", gen: "hundred",
      read: [
        "Jede Formel, die du je wirken wirst, steht in einem Kreis. Ein Kreis, der nicht schließt, hält nichts: Die Kraft läuft durch die Lücke ab, wie Wasser aus einem gesprungenen Krug. Darum beginnt jede Ausbildung mit dem Kreis, und darum endet sie nie ganz mit ihm.",
        "Einen Kreis mit dem Zirkel zu ziehen, lernt jeder in einer Stunde. Einen Kreis aus freier Hand zu ziehen, der [[rund]], [[geschlossen]] und [[gleichmäßig]] ist, lernt man in einem Jahr. Der Zirkel bleibt in der Werkstatt; im Feld, im Staub, unter Zeitdruck hast du nur die Hand.",
        "Zeichne in einem Zug. Setz nicht ab, bessere nicht nach. Ein nachgebesserter Kreis ist ein Kreis mit einer Naht, und an Nähten reißt es.",
      ],
      glosses: {
        rund: "Jeder Punkt der Linie gleich weit von der Mitte. Geprüft mit der Prüfscheibe (Anhang A).",
        geschlossen: "Anfang und Ende treffen sich ohne Lücke und ohne Überstand.",
        gleichmäßig: "Gleiche Strichstärke, kein Zittern, kein Absetzen.",
      },
      task: [
        "Zeichne auf einem großen Blatt hundert Kreise von etwa zwei Fingern Durchmesser, jeden in einem Zug, im Uhrzeigersinn.",
        "Zähle mit: Nach jedem zehnten Kreis eine Pause von drei Atemzügen.",
        "Zeige das Blatt dem Meister. Er legt die Prüfscheibe auf zehn Kreise seiner Wahl.",
        "Wiederhole die Übung jede Woche, bis neun von zehn geprüften Kreisen im engen Ring liegen. Dann gegen den Uhrzeigersinn, dann mit der schwachen Hand.",
      ],
      check: ["Rundheit", "Schluss", "Strich", "Größentreue"],
    },
    {
      id: "l14", part: "II", title: "Konstruieren vor freihand I: Kreis, Kreuz, Sechsteilung", gen: "construct1",
      read: [
        "Jede Figur wird zuerst einmal genau konstruiert, auf einer eigenen [[Werkseite]], mit Zirkel und Lineal. Erst dann wird sie freihändig gezeichnet, zehnmal, daneben. Die Konstruktion ist kein Hilfsmittel zum Nachfahren, sondern der Maßstab, an dem du deine Freihandfiguren misst.",
        "Das Kreuz: Ziehe einen Durchmesser. Setze den Zirkel nacheinander in beide Enden, mit einer Öffnung größer als der Radius, und schlage oben und unten je einen Bogen. Die Verbindung der Schnittpunkte ist die [[Mittelsenkrechte]] und steht genau senkrecht auf dem Durchmesser.",
        "Die Sechsteilung ist die leichteste aller Teilungen, denn der Radius passt genau sechsmal auf den Kreis. Setze den Zirkel mit unveränderter Öffnung auf den Kreis und schreite rundum ab. Jeder zweite Punkt ergibt das Dreieck, alle sechs das Sechseck, zwei Dreiecke ineinander den Sechsstern.",
      ],
      glosses: {
        Werkseite: "Eigene Seite für genaue Konstruktionen mit Zirkel und Lineal; Maßstab für die Freihandzeichnung.",
        Mittelsenkrechte: "Gerade, die eine Strecke genau in der Mitte rechtwinklig schneidet. Mit zwei Zirkelschlägen konstruiert.",
      },
      task: ["Konstruiere auf einer Werkseite Kreuz, Dreieck, Sechseck und Sechsstern.", "Zeichne jede Figur zehnmal freihändig daneben.", "Lege die Prüfscheibe auf deinen besten Freihandkreis und den Zirkel an deine beste Sechsteilung."],
      check: ["Konstruktion", "Freihand", "Teilung"],
    },
    {
      id: "l15", part: "II", title: "Konstruieren II: Viereck, Achteck, Fünfstern", gen: "construct2",
      read: [
        "Aus dem Kreuz wird das Viereck: Die vier Enden der beiden Durchmesser sind seine Ecken. Halbiert man die vier Winkel, wieder mit zwei Zirkelschlägen, erhält man acht Punkte und das Achteck.",
        "Der Fünfstern ist schwerer, und er ist das erste Prüfungsstück. Halbiere einen waagrechten Radius. Setze den Zirkel in diesen Mittelpunkt und öffne ihn bis zum obersten Punkt des Kreises. Schlage einen Bogen bis auf den waagrechten Durchmesser. Der Abstand von dort zum obersten Punkt ist die Seite des Fünfecks. In dieser Strecke steckt ein Verhältnis, das die Bauleute so nennen: [[Goldener Schnitt]].",
        "Wer den Fünfstern freihändig zeichnet, zieht ihn in einem Zug durch alle fünf Spitzen und kommt am Anfang wieder an. Ein Fünfstern mit Lücke an der Spitze ist ein Fünfstern, der etwas hinauslässt.",
      ],
      glosses: { "Goldener Schnitt": "Teilungsverhältnis, bei dem sich der kleine Teil zum großen verhält wie der große zum Ganzen. Steckt in jedem Fünfstern." },
      task: ["Konstruiere Viereck, Achteck und Fünfeck auf einer Werkseite.", "Zeichne den Fünfstern zehnmal freihändig, jeden in einem Zug.", "Lass den Meister die Spitzen deines besten Sterns mit dem Zirkel nachmessen."],
      check: ["Konstruktion", "Freihand", "Schluss"],
    },
    {
      id: "l16", part: "II", title: "Konstruieren III: Die Figuren der Ordnungen", gen: "orders",
      read: [
        "Jeder Grad einer Formel hat seinen Knoten, und von der dritten Ordnung an verbinden sich die Knoten zu einer Figur, die die Last des Kreises trägt: Dreieck, Viereck, Fünfstern, Sechsstern und so fort bis zur neunten Ordnung.",
        "Das Siebeneck lässt sich mit Zirkel und Lineal nicht genau konstruieren. Die Werkstätten lehren eine [[Näherung]]; wer sie kennt, sieht ihr den Fehler nicht an. Wer sie nicht kennt, zeichnet sieben ungleiche Seiten und wundert sich, warum die Formel schief zieht.",
      ],
      glosses: { Näherung: "Eine Konstruktion, die fast genau ist. Beim Siebeneck so gut, dass das Auge den Fehler nicht sieht." },
      task: ["Konstruiere jede Figur einmal mit Zirkel und Lineal auf einer Werkseite.", "Zeichne sie danach zehnmal freihändig daneben.", "Lege die Konstruktion neben die Freihandzeichnungen und markiere die beste."],
      check: ["Teilung", "Schluss", "Strich"],
    },
    {
      id: "l17", part: "II", title: "Doppelkreis und Ringe", gen: "rings",
      read: [
        "Ein Kreis hält, ein [[Doppelkreis]] schützt. Zwischen den beiden Linien liegt ein Band, in das man Zeichen und Worte schreiben kann, und das Band muss überall gleich breit sein. Ein Doppelkreis, der an einer Stelle eng wird, ist an dieser Stelle schwach.",
        "Um den Kreis einer Formel liegen außerdem die [[Weitenringe]]. Ihre Zahl sagt, wie weit die Formel reicht: einer für die Berührung, mehr für Nähe und Ferne. Sie werden zuletzt gezogen, mit gleichem Abstand, von innen nach außen.",
        "Freihändig gelingt der Doppelkreis, indem man zuerst den inneren Kreis zieht und dann den äußeren, den Blick nicht auf die Feder, sondern auf das Band gerichtet. Das Auge hält den Abstand, nicht die Hand.",
      ],
      glosses: {
        Doppelkreis: "Zwei Kreise um dieselbe Mitte mit gleichmäßigem Band dazwischen.",
        Weitenringe: "Ringe außen um den Kreis einer Formel; ihre Zahl gibt die Reichweite an.",
      },
      task: ["Zeichne zehn Doppelkreise freihändig mit einem Band von einer Fingerbreite.", "Zeichne um drei von ihnen zwei und drei Weitenringe.", "Miss das Band an vier Stellen; der Meister vermerkt die größte Abweichung."],
      check: ["Band", "Rundheit", "Abstand"],
    },
    {
      id: "l18", part: "II", title: "Die Lochpause", gen: "pounce",
      read: [
        "Manchmal gibt der Meister ein Muster heraus, das zu verwickelt ist, um es beim ersten Mal frei zu zeichnen. Dann gibt er keine Vorlage zum Nachfahren, sondern eine [[Lochpause]]: ein Blatt, auf dem nur einzelne Punkte der Figur durchstochen sind.",
        "Du legst die Lochpause auf dein Blatt, tupfst mit einem Säckchen Kohlestaub über die Löcher und hebst sie ab. Zurück bleiben Punkte, nicht Linien. Die Linien dazwischen ziehst du selbst. Mit jedem Durchgang bekommst du weniger Punkte: zwölf, dann sechs, dann drei, dann keine.",
      ],
      glosses: { Lochpause: "Musterblatt mit durchstochenen Stützpunkten. Kohlestaub überträgt die Punkte, die Linien zieht der Lehrling selbst." },
      task: ["Nimm das Pausblatt des Meisters aus dem Anhang B.", "Übertrage die zwölf Punkte und verbinde sie frei. Dann sechs, dann drei.", "Zeichne die Figur zuletzt ganz ohne Punkte."],
      check: ["Formtreue", "Schluss", "Strich"],
    },

    // --- III. Die Glyphen ---------------------------------------------------------
    {
      id: "l19", part: "III", title: "Was eine Glyphe ist",
      read: [
        "Eine [[Glyphe]] ist ein Zeichen, das eine Sache in den Kreis bringt: eine Essenz, eine Bewegung, einen Preis, eine Zeit. Sie ist keine Magie. Ein Zeichen auf Papier tut nichts, solange niemand Kraft hindurchschickt. Aber wenn Kraft hindurchgeht, nimmt sie genau den Weg, den das Zeichen ihr vorgibt – auch den falschen.",
        "Darum gilt in jeder Werkstatt: Ein fehlerhaftes Zeichen wirkt mit seinen Fehlern. Ein zu offenes Feuerdreieck brennt, aber es brennt nach außen. Ein schief gesetzter Knoten hält, aber er zieht.",
        "Jede Glyphe hat einen [[Kern]] und kann [[Beizeichen]] tragen. Der Kern bestimmt, was sie ist; die Beizeichen sagen, wie und wo. Lerne die Kerne zuerst und so lange, bis du sie im Halbschlaf zeichnest.",
        "Die Glyphen dieses Teils sind dieselben, die in den Kreisen deines späteren Zauberbuchs stehen. Was du hier lernst, liest du dort wieder.",
      ],
      glosses: {
        Glyphe: "Zeichen, das eine Sache in den Kreis bringt: Essenz, Schule, Bewegung, Preis oder Zeit.",
        Kern: "Der Teil einer Glyphe, der bestimmt, was sie ist. Darf nie fehlen.",
        Beizeichen: "Zusatz an einer Glyphe, der Umstände angibt. Darf in der Schnellglyphe wegfallen.",
      },
      task: ["Schreibe aus dem Gedächtnis auf die Wachstafel, was Kern und Beizeichen sind, und zeige es dem Meister."],
      check: ["Verständnis"],
    },
    {
      id: "l20", part: "III", title: "Die Essenzen", gen: "essences",
      read: [
        "Sechzehn [[Essenzen]] kennt die Lehre, in acht Gegensatzpaaren. Jede Formel trägt mehrere von ihnen, in verschiedenen Anteilen; die stärkste heißt [[Hauptessenz]] und steht im Kern des Kreises.",
        "Zu jeder Essenz gehören eine Stunde, eine Farbe, ein Metall und eine Richtung. Du musst sie nicht auswendig wissen, um zu zeichnen, aber du musst sie wissen, um zu verstehen, warum eine Formel am Mittag leichter fällt als um Mitternacht.",
      ],
      glosses: {
        Essenzen: "Die sechzehn Grundstoffe der Magie. Eine Formel ist eine Mischung aus ihnen.",
        Hauptessenz: "Die Essenz mit dem größten Anteil. Sie steht in der Mitte des Kreises und im roten Bogen des Essenzrings.",
      },
      task: ["Zeichne jede Essenz zehnmal auf die Wachstafel, ihr Gegenstück daneben.", "Lass dir vom Meister Namen zurufen und zeichne die Glyphe aus dem Gedächtnis.", "Umgekehrt: Der Meister zeichnet, du nennst Namen, Stunde und Gegenpol."],
      check: ["Formtreue", "Gedächtnis", "Gegenpole"],
    },
    {
      id: "l21", part: "III", title: "Die Schulen", gen: "schools",
      read: [
        "Die Essenz ist das Hauptwort einer Formel, die [[Schule]] ihr Verb: Sie sagt, was mit dem Stoff geschieht – abwehren, rufen, erkennen, binden, entfesseln, täuschen, entziehen, wandeln. Jede Schule hat ihre Figur, die als [[Kernsiegel]] in der Mitte des Kreises steht.",
      ],
      glosses: { Schule: "Die Art des Wirkens; das Verb der Formel.", Kernsiegel: "Die Figur der Schule im Zentrum des Kreises, darin die Hauptessenz." },
      task: ["Zeichne jedes Kernsiegel einmal mit Zirkel und Lineal, dann fünfmal freihändig.", "Ordne die Siegel nach der Zahl ihrer Ecken."],
      check: ["Konstruktion", "Freihand", "Zuordnung"],
    },
    {
      id: "l22", part: "III", title: "Die Zeichen des Zeichenrings", gen: "signs",
      read: [
        "Im [[Zeichenring]] stehen die Zeichen, die der Essenz Bewegung geben: ob sie als Säule austritt, sich verteilt, zieht oder stößt. Alle Zeichen sind so gezeichnet, dass ihre Spitze in die Wirkrichtung weist. Gehäuft im Norden des Kreises bedeuten sie eine gerichtete Wirkung, rundum verteilt eine Wirkung nach allen Seiten.",
      ],
      glosses: { Zeichenring: "Der Ring zwischen Weitenringen und Essenzring; trägt die Bewegungszeichen." },
      task: ["Zeichne jedes Zeichen dreimal: aufrecht, gedreht nach Osten, gedreht nach Süden.", "Erkläre dem Meister, was ein umgekehrt gezeichnetes Zug-Zeichen bewirkt."],
      check: ["Formtreue", "Richtung"],
    },
    {
      id: "l23", part: "III", title: "Die Ecksteine", gen: "components",
      read: [
        "In den vier Ecken um den Kreis stehen die [[Ecksteine]]: Sie sagen, was die Formel vom Wirker verlangt. Stimme, Geste, Stoff, Fokus. Fehlt ein Eckstein, braucht die Formel ihn nicht; steht er da, darf er beim Wirken nicht fehlen.",
        "Der Stoff trägt sein [[alchemistisches Zeichen]], denn nichts entsteht aus nichts: Der Stoff ist der Preis, den die Formel verlangt, und das Zeichen sagt, welcher Art dieser Preis ist. Mehr dazu im vierten Teil.",
      ],
      glosses: { Ecksteine: "Die Komponenten einer Formel, in den Ecken um den Kreis.", "alchemistisches Zeichen": "Zeichen für die Art eines Stoffes, z. B. Schwefel, Salz, Quecksilber oder ein Metall." },
      task: ["Zeichne die Ecksteine je fünfmal.", "Nenne für drei Formeln aus deinem Buch die Ecksteine, ohne nachzusehen."],
      check: ["Formtreue", "Wissen"],
    },
    {
      id: "l24", part: "III", title: "Die Zeitmarken", gen: "casting",
      read: ["Über dem Kreis steht die [[Zeitmarke]]: wie lange das Wirken dauert. Ein Punkt für einen Augenblick, ein Blitz für das Schnelle, ein Bogen für eine volle Bewegung, das Stundenglas für das Ritual."],
      glosses: { Zeitmarke: "Zeichen über dem Kreis für die Wirkzeit der Formel." },
      task: ["Zeichne die Zeitmarken je fünfmal, so klein, wie sie über einem Kreis stehen."],
      check: ["Formtreue", "Größe"],
    },
    {
      id: "l25", part: "III", title: "Schwellentore und Siegelband", gen: "gates",
      read: [
        "Nicht jede Formel trifft wehrlos. Wo sich ein Ziel ihr widersetzen kann, unterbricht ein rotes [[Schwellentor]] das Schriftband: ein Auge für den Willen, ein Quader für die Zähigkeit, ein Pfeil für die Gewandtheit. Zwei Tore bedeuten, dass ein Ziel die Wirkung halbieren kann; ein gestricheltes Tor, dass Widerstand nicht nötig ist.",
        "Unter dem Band liegt bei manchen Formeln eine Schraffur, das [[Siegelband]]: Diese Formel muss gegen die Kraft bestehen, mit der manche Wesen Magie von sich abhalten.",
      ],
      glosses: { Schwellentor: "Rotes Tor im Schriftband: hier kann sich das Ziel wehren.", Siegelband: "Schraffur unter dem Schriftband: Die Formel muss gegen Zauberresistenz bestehen." },
      task: ["Suche in der Ansicht des Meisters alle Tore und benenne sie.", "Zeichne ein Schriftband mit zwei Toren aus dem Gedächtnis."],
      check: ["Erkennen", "Zeichnen"],
    },
    {
      id: "l26", part: "III", title: "Das Gestenblatt", gen: "gestures",
      read: [
        "Die meisten Formeln verlangen eine [[Geste]]. Sie wird nicht gezeichnet, sie wird getan; aber sie wird gezeichnet, damit man sie nicht vergisst. Jede Schule hat ihre Grundgesten, und jede Formel wählt aus ihnen.",
        "Das Gestenblatt legt jeder Lehrling selbst an, denn keine zwei Hände sind gleich. Du zeichnest den Umriss deiner eigenen Hand und trägst ein, wie die Finger stehen. Eine fremde Hand als Vorlage lehrt dich die Gesten eines anderen.",
      ],
      glosses: { Geste: "Bewegung der Hände, die eine Formel verlangt. Sie folgt der Schule und der Gestalt der Wirkung." },
      task: ["Lege die Hand flach auf ein Blatt und zeichne ihren Umriss. Das ist dein Gestenblatt.", "Trage für jede Schule eine Grundgeste ein: Stellung der Finger als Punkte, Bewegung als Pfeil.", "Führe dem Meister drei Gesten vor, ohne auf das Blatt zu sehen."],
      check: ["Genauigkeit", "Gedächtnis", "Haltung"],
    },

    // --- IV. Die Zeichen der Stoffe -----------------------------------------------
    {
      id: "l27", part: "IV", title: "Das brennende Scheit", gen: "tria",
      read: [
        "Wirf ein Scheit ins Feuer und sieh hin. Es brennt: Das ist der [[Sulfur]], das Brennende, das in allem steckt, was Farbe, Duft und Wärme hat. Es raucht: Das ist der [[Mercurius]], das Flüchtige, das aufsteigt und sich verwandelt. Und am Ende bleibt Asche: Das ist das [[Sal]], das Feste, das nicht brennt und nicht fliegt.",
        "Diese drei nennt die Lehre die [[tria prima]], die drei Grundsätze. Jeder Stoff trägt alle drei, aber in verschiedenem Maß. Wachs ist fast nur Sulfur, Salz fast nur Sal, Quecksilber der reinste Mercurius. In den Formeln stehen sie für Feuer, Wandel und Ordnung.",
      ],
      glosses: {
        Sulfur: "Der brennende Grundsatz: Brennbarkeit, Farbe, Wärme. Zeichen: Dreieck über Kreuz. Essenz Ignis.",
        Mercurius: "Der flüchtige Grundsatz: Verdampfen, Fließen, Verwandeln. Essenz Fluxus.",
        Sal: "Der feste Grundsatz: Asche, Kristall, Gestalt. Zeichen: Kreis mit Querstrich. Essenz Ordo.",
        "tria prima": "Die drei Grundsätze Sulfur, Mercurius und Sal.",
      },
      task: ["Zeichne die drei Zeichen je zehnmal frei.", "Ordne sechs Stoffe ihrem vorherrschenden Grundsatz zu: Wachs, Salz, Quecksilber, Kohle, Kreide, Weingeist. Die Lösung steht kopfüber auf der nächsten Seite."],
      check: ["Zeichen", "Zuordnung"],
    },
    {
      id: "l28", part: "IV", title: "Die Elemente als Dreiecke", gen: "elements",
      read: [
        "Die vier Elemente sind die einfachsten Glyphen überhaupt: ein Dreieck mit der Spitze nach oben, eins mit der Spitze nach unten, und ein Querstrich. Was nach oben strebt, Feuer und Luft, zeigt nach oben; was sinkt, Wasser und Erde, zeigt nach unten. Der Querstrich unterscheidet das Leichte vom Schweren seiner Richtung: Luft ist gedämpftes Feuer, Erde beschwertes Wasser.",
        "Jedes Element hat zwei [[Qualitäten]]: heiß oder kalt, feucht oder trocken. Feuer ist heiß und trocken, Luft heiß und feucht, Wasser kalt und feucht, Erde kalt und trocken. Legt man die Qualitäten über Kreuz, liegt jedes Element zwischen seinen beiden, und Gegensätze stehen sich gegenüber. Über allen vieren steht die [[Quintessenz]], das fünfte, das man nicht zeichnen kann.",
        "Die Dreiecke sind zugleich eine Übung in Geradlinigkeit. Konstruiere das gleichseitige Dreieck einmal aus der Sechsteilung, dann zeichne es frei, bis alle drei Seiten gleich sind.",
      ],
      glosses: {
        Qualitäten: "Heiß, kalt, feucht, trocken. Jedes Element hat zwei davon.",
        Quintessenz: "Das fünfte Element über den vieren; in der Lehre der Ursprung der Essenzen.",
      },
      task: ["Zeichne die vier Elementdreiecke je zehnmal frei; prüfe die Seiten mit dem Zirkel.", "Zeichne das Qualitätenkreuz aus dem Gedächtnis und setze die Elemente ein."],
      check: ["Dreiecke", "Kreuz"],
    },
    {
      id: "l29", part: "IV", title: "Die Wandelsterne", gen: "planets",
      read: [
        "Sieben [[Wandelsterne]] ziehen ihre Bahn, und jedem gehört ein Metall. Ihre Zeichen sind aus nur drei Bausteinen gebaut: dem [[Kreis]] für das Vollkommene, dem [[Halbmond]] für das Wandelbare, dem [[Kreuz]] für den Stoff. Wer diese drei sicher zeichnet, kann alle sieben lesen.",
        "Kupfer gehört der Venus. Sie ist warm und feucht wie die [[Luft]], und wie die Luft bindet sie, ohne zu zwingen: durch Anziehung. Wer Kupfer in eine Formel gibt, gibt ihr Weite und Verbindung.",
      ],
      glosses: {
        Wandelsterne: "Die sieben beweglichen Gestirne der alten Lehre, jedes mit seinem Metall.",
        Kreis: "Baustein der Planetenzeichen: das Vollkommene, der Geist.",
        Halbmond: "Baustein der Planetenzeichen: das Wandelbare, die Seele.",
        Kreuz: "Baustein der Planetenzeichen: der Stoff, die vier Elemente.",
        Luft: "Element des Atems und der Weite; warm und feucht. Essenz Aer.",
      },
      task: ["Zeichne Kreis, Halbmond und Kreuz je zwanzigmal.", "Setze daraus alle sieben Zeichen zusammen, ohne auf die Ansicht zu sehen.", "Schreibe zu jedem Zeichen Metall und Essenz."],
      check: ["Bausteine", "Zusammensetzung", "Zuordnung"],
    },
    {
      id: "l30", part: "IV", title: "Der Wochenkreis", gen: "week",
      read: [
        "Ordnet man die sieben Wandelsterne nach der Zeit, die sie für ihren Lauf brauchen, vom langsamsten zum schnellsten, erhält man die [[alte Reihe]]: Saturn, Jupiter, Mars, Sonne, Venus, Merkur, Mond.",
        "Setze sie in dieser Folge auf die sieben Ecken eines Siebenecks und verbinde jede Ecke mit der dritten nach ihr, sodass ein [[Siebenstern]] entsteht. Folgt man den Linien des Sterns, kommt man an den Wandelsternen in einer neuen Reihenfolge vorbei: Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn. Das ist die Woche, in der jeder Tag einem Wandelstern gehört.",
        "Darum, sagen manche Werkstätten, zeichnet man Zinnglyphen am liebsten am Tag des Jupiter und Silberglyphen am Tag des Mondes. Ob das stimmt, sollst du selbst herausfinden. Aufschreiben sollst du es auf jeden Fall.",
      ],
      glosses: {
        "alte Reihe": "Die sieben Wandelsterne nach ihrer Umlaufzeit: Saturn, Jupiter, Mars, Sonne, Venus, Merkur, Mond.",
        Siebenstern: "Siebenzackiger Stern im Siebeneck; seine Linien führen von der alten Reihe zur Woche.",
      },
      task: ["Konstruiere ein Siebeneck nach der Näherung aus Lektion 16 und zeichne den Siebenstern hinein.", "Setze die Zeichen der Wandelsterne in der alten Reihe auf die Ecken.", "Folge dem Stern und schreibe die Wochentage dazu."],
      check: ["Stern", "Reihe", "Woche"],
    },
    {
      id: "l31", part: "IV", title: "Stoffe lesen", gen: "materials",
      read: ["Steht ein Stoff im Eckstein einer Formel, so bringt er seine Essenzen mit. Ein Stück Zinn gibt Ordnung und Leben, ein Körnchen Schwefel Feuer. Wer die Zeichen der Stoffe lesen kann, sieht einer Formel schon an ihrem Preis an, wohin sie zieht."],
      task: ["Decke die rechte Spalte ab und nenne zu jedem Stoff sein Zeichen und seine Essenz.", "Suche drei weitere Stoffe in deinem Buch und lies sie ebenso."],
      check: ["Zeichen", "Essenz"],
    },
    {
      id: "l32", part: "IV", title: "Mischungen in Teilen", gen: "mixtures",
      read: [
        "Eine Formel ist eine Mischung, und Mischungen schreibt man wie ein Rezept: in [[Teilen]]. Zehn Teile ergeben das Ganze. Was zwischen zwei Teilen liegt, nennt man stark oder schwach, knapp oder gut.",
        "Wer eine Formel in Teilen lesen kann, sieht sofort, was sie trägt und was sie nur würzt.",
      ],
      glosses: { Teilen: "Maß für den Anteil einer Essenz: ein Teil ist ein Zehntel des Ganzen." },
      task: ["Lies die Mischungen laut vor.", "Schreibe für eine weitere Formel deines Buches die Mischung in Teilen auf, nur nach ihrem Essenzring."],
      check: ["Lesen", "Schreiben"],
    },

    // --- V. Schnellglyphen -----------------------------------------------------------
    {
      id: "l33", part: "V2", title: "Vom Vollzeichen zum Kurzzeichen", gen: "quickderive",
      read: [
        "Am Tisch eines Gasthauses, im Regen, im Kampf bleibt keine Zeit für den vollen Kreis. Wer eine Formel einmal vollständig gezeichnet und verstanden hat, darf sie mit ihrer [[Schnellglyphe]] abrufen: fünf Striche statt fünfzig.",
        "Die Schnellglyphe entsteht, indem man alle Beizeichen weglässt und vom Kern nur das behält, was ihn von allen anderen unterscheidet. Den Kern weglassen darf man nie.",
      ],
      glosses: { Schnellglyphe: "Kurzzeichen einer Formel: Kreis, Schulfigur, Hauptessenz, Gestaltstrich, Gradpunkte." },
      task: ["Leite die Schnellglyphe in drei Schritten her, wie in der Ansicht gezeigt.", "Begründe in einem Satz, welche Teile du weggelassen hast."],
      check: ["Herleitung", "Begründung"],
    },
    {
      id: "l34", part: "V2", title: "Die Schnellglyphen deiner Formeln", gen: "quicklist",
      read: ["Hier stehen die Schnellglyphen der kleinen Formeln aus deinem Buch. Lerne sie, wie man Gesichter lernt: nicht Strich für Strich, sondern als Ganzes."],
      task: ["Decke die Namen ab und benenne jede Glyphe.", "Zeichne jede Glyphe aus dem Gedächtnis, dann vergleiche."],
      check: ["Erkennen", "Zeichnen"],
    },
    {
      id: "l35", part: "V2", title: "Drei Drills",
      read: [
        "[[Zeitdrill]]: Eine Schnellglyphe zwanzigmal, solange eine Kerze um eine Fingerbreite herunterbrennt. Danach die drei schlechtesten markieren.",
        "[[Blindzeichnung]]: Augen schließen, die Glyphe fünfmal zeichnen, Augen öffnen, vergleichen. So lernt die Hand, ohne dass das Auge hilft.",
        "[[Luftzeichnung]]: Mit ausgestrecktem Finger groß in die Luft. Der Meister ruft „falsch“, sobald ein Strich fehlt. Wer so übt, kann im Dunkeln wirken.",
      ],
      glosses: { Zeitdrill: "Übung auf Geschwindigkeit bei gleichbleibender Form.", Blindzeichnung: "Zeichnen mit geschlossenen Augen; schult das Gedächtnis der Hand.", Luftzeichnung: "Zeichnen mit dem Finger in die Luft, wie beim Wirken." },
      task: ["Jeden Tag ein Drill, eine Woche lang. Hake die Tage ab: ☐ ☐ ☐ ☐ ☐ ☐ ☐"],
      check: ["Tempo", "Form"],
    },

    // --- VI. Kreise lesen ----------------------------------------------------------------
    {
      id: "l36", part: "VI", title: "Von außen nach innen", gen: "anatomy",
      read: ["Ein Kreis wird von außen nach innen gelesen und von innen nach außen gezeichnet. Außen steht, was die Welt von der Formel sieht: ihre Reichweite, ihre Gestalt, ihr Wort. Innen steht, was sie ist."],
      task: ["Lies den Kreis Schicht für Schicht laut vor, ohne auf die Liste zu sehen.", "Fasse ihn in einem Satz zusammen."],
      check: ["Schichten", "Zusammenfassung"],
    },
    {
      id: "l37", part: "VI", title: "Lückenkreise", gen: "gaps",
      read: ["In jedem dieser Kreise fehlt eine Schicht. Wer weiß, was dort stehen müsste, hat den Kreis verstanden; wer nur sieht, dass etwas fehlt, hat ihn erst gesehen. Die Lösungen stehen kopfüber hinter dem letzten Kreis; erst umblättern, wenn alle Kreise ergänzt sind."],
      taskFirst: "Die vier Kreise folgen auf den nächsten Seiten.",
      task: ["Benenne für jeden Kreis die fehlende Schicht.", "Zeichne sie auf der Wachstafel nach, wie sie sein müsste."],
      check: ["Erkennen", "Ergänzen"],
    },
    {
      id: "l38", part: "VI", title: "Zwei Kreise vergleichen", gen: "compare",
      read: ["Verwandte Formeln haben verwandte Kreise. Lege zwei nebeneinander und frage: Was ist gleich, was anders, und warum?"],
      taskFirst: "Die beiden Kreise folgen.",
      task: ["Nenne drei Gemeinsamkeiten und drei Unterschiede.", "Sage voraus, welche der beiden weiter reicht und welche länger hält, nur nach dem Kreis."],
      check: ["Vergleich", "Begründung"],
    },

    // --- VII. Kleine Formeln -------------------------------------------------------------
    {
      id: "l39", part: "VII", title: "Mein erster Zauber", gen: "first",
      read: [
        "Es gibt einen Tag, an dem zum ersten Mal etwas geschieht. Ein Licht, das nicht von einer Flamme kommt. Ein Staubkorn, das sich hebt. Die meisten Lehrlinge erschrecken. Schreib es auf, solange du es noch weißt; später wirst du es nicht mehr glauben.",
      ],
    },
    {
      id: "formula", part: "VII", title: "", template: true,
      read: ["Lerne die Formel in drei Durchgängen: Jedes Mal fehlen mehr Wörter, bis du sie ganz aus dem Gedächtnis sprichst."],
      check: ["Kreis", "Formel", "Geste"],
    },

    // --- VIII. Das Gesellenstück -----------------------------------------------------------
    {
      id: "l40", part: "VIII", title: "Eine Formel zuschneiden", gen: "tailor",
      read: [
        "Die meisten Formeln, die du je wirken wirst, hat jemand anders geschrieben. Aber jede Formel lässt sich verengen. Wer eine allgemeine Formel nimmt und sie auf einen einzigen, genau bestimmten Zweck verengt, erhält einen [[Zuschnitt]]: eine kleinere, eigensinnige, oft liebenswerte Formel. Viele Alltagszauber sind so entstanden.",
        "Zugeschnitten wird, indem man etwas festlegt, was die [[Grundformel]] offen lässt: das Ziel, die Dauer, die Weite, die Gestalt. Zugeschnitten wird nie der Kern. Die Schule bleibt, die Hauptessenz bleibt; nur die Beizeichen werden genauer, und manchmal verschiebt sich eine Nebenessenz.",
        "Ein guter Zuschnitt ist so eng, dass man ihn nicht mehr für etwas anderes gebrauchen kann. Das ist kein Fehler, sondern sein Wesen.",
      ],
      glosses: {
        Zuschnitt: "Eine allgemeine Formel, verengt auf einen einzigen, genau bestimmten Zweck.",
        Grundformel: "Die allgemeine Formel, aus der ein Zuschnitt entsteht.",
      },
      task: ["Lies den Vergleich: Was legt der Zuschnitt fest, was die Grundformel offen ließ?", "Wähle eine kleine Formel aus deinem Buch und entwirf auf der Wachstafel einen eigenen Zuschnitt: Zweck, Ziel, Dauer, Name.", "Trage ihn dem Meister vor und begründe, warum der Kern unverändert bleibt."],
      check: ["Verständnis", "Entwurf", "Begründung"],
    },
    {
      id: "l41", part: "VIII", title: "Das eigene Handbuch", gen: "firstpage",
      read: [
        "Eines Tages legt der Meister ein leeres Buch auf deinen Tisch. Es ist dein [[Reinbuch]], und die erste Seite darin ist dein [[Gesellenstück]]. Auf ihr steht eine einzige kleine Formel, vollständig: Kreis, Formel, Ecksteine, Geste, Mischung.",
        "Die Seite wird vorher geplant, nicht darauf. Auf Abfallpapier entsteht ein Entwurf in Originalgröße, mit Rand, Kreis, Textblock. Dann wird die Pergamentseite gestochen und liniert, der Kreis zuerst gezogen, solange die Hand ruhig ist, danach die Schrift. Die Rubrik kommt zuletzt.",
        "Fehler auf dieser Seite werden nicht geschabt. Ein Strich, der danebengeht, bleibt stehen, und du zeichnest daneben richtig. So steht in jedem Reinbuch auf der ersten Seite, wer man war, als man anfing.",
      ],
      glosses: { Gesellenstück: "Die erste Seite im Reinbuch, vom Meister abgenommen. Beendet die Lehrzeit dieses Heftes." },
      task: ["Entwirf deine erste Seite auf Abfallpapier in Originalgröße und lass den Entwurf abnehmen.", "Übertrage sie ins Reinbuch: stechen, linieren, Kreis, Schrift, Rubrik.", "Zeige die fertige Seite dem Meister. Sie wird nicht verbessert, nur beurteilt."],
      check: ["Entwurf", "Kreis", "Schrift", "Gesamtbild"],
    },
    {
      id: "l42", part: "VIII", title: "Die Prüfung vor dreien", gen: "finalExam",
      read: [
        "Am Ende des ersten Heftes steht keine Prüfung durch den Meister allein. Geprüft wird [[vor dreien]]: ein Prüfer, der Fragen stellt und Aufgaben gibt; eine Aufsicht, die darauf achtet, dass alles mit rechten Dingen zugeht; ein Schreiber, der festhält, was geschieht. Der eigene Meister darf eine der drei Rollen übernehmen, aber nicht die des Prüfers.",
        "Geprüft wird, was dieses Heft gelehrt hat, nicht mehr: ein Blatt mit Kreisen, Glyphen aus dem Gedächtnis, ein Kreis, der gelesen wird, eine kleine Formel, dreimal in Folge gewirkt, und das Gesellenstück. Wer besteht, darf das zweite Heft aufschlagen.",
        "Wer nicht besteht, wiederholt nach einem halben Jahr. Das ist keine Schande. Die Schande wäre, ein Buch zu führen, das man nicht lesen kann.",
      ],
      glosses: { "vor dreien": "Prüfung mit Prüfer, Aufsicht und Schreiber; der eigene Meister prüft nicht selbst." },
    },

    // --- Anhang ------------------------------------------------------------------------------
    { id: "a-disc", part: "A", title: "A · Die Prüfscheibe", gen: "disc", unnumbered: true },
    { id: "a-pounce", part: "A", title: "B · Pausblätter des Meisters", gen: "pounceSheets", unnumbered: true },
    { id: "a-grade", part: "A", title: "C · Bewertungsbogen des Meisters", gen: "gradeSheet", unnumbered: true },
    { id: "a-promote", part: "A", title: "D · Versetzungsbogen", gen: "promoteSheet", unnumbered: true },
    { id: "a-gloss", part: "A", title: "E · Glossar", gen: "glossary", unnumbered: true },
  ],
};
