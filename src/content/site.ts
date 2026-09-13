export type Lang = "en" | "de";
export type L = Record<Lang, string>;
export type LL = Record<Lang, string[]>;

export const profile = {
  name: "Sidharth Vijayan Krishnan",
  email: "sidharthvk80@gmail.com",
  role: {
    en: "Java backend & full-stack engineer",
    de: "Java-Backend- & Full-Stack-Entwickler",
  } as L,
  links: {
    github: "https://github.com/Sidharthkris",
    linkedin: "https://www.linkedin.com/in/sidharth-vijayan-krishnan",
    site: "https://sidharthkris.github.io",
  },
};

export const ui = {
  nav: {
    about: { en: "About", de: "Über mich" } as L,
    skills: { en: "Skills", de: "Fähigkeiten" } as L,
    work: { en: "Experience", de: "Werdegang" } as L,
    projects: { en: "Projects", de: "Projekte" } as L,
    contact: { en: "Contact", de: "Kontakt" } as L,
  },
  cmdHint: { en: "Search", de: "Suche" } as L,
  cmdPlaceholder: {
    en: "Jump to a section, open a project, copy my email…",
    de: "Zu einem Abschnitt springen, ein Projekt öffnen, E-Mail kopieren…",
  } as L,
  cmdEmpty: { en: "Nothing matches that.", de: "Keine Treffer." } as L,
  back: { en: "Back to all work", de: "Zurück zur Übersicht" } as L,
  readCase: { en: "Read the case study", de: "Fallstudie lesen" } as L,
  openProject: { en: "Open project", de: "Projekt öffnen" } as L,
  copied: { en: "Copied", de: "Kopiert" } as L,
  downloadCv: { en: "Download CV (PDF)", de: "Lebenslauf (PDF)" } as L,
  viewSource: { en: "View source", de: "Quellcode ansehen" } as L,
  liveDemo: { en: "Live demo", de: "Live-Demo" } as L,
};

export const hero = {
  badge: {
    en: "Live model of my master's thesis — change the hall, move your cursor into the crowd",
    de: "Live-Modell meiner Masterarbeit — Saal wechseln, Cursor in die Menge bewegen",
  } as L,
  intro: {
    en: "Hey, I'm Sidharth. I build with Java and Spring Boot on one side and React and TypeScript on the other, and I spend my research time on autonomous agents and crowd simulation. M.Sc. Computer Science, TU Clausthal.",
    de: "Hi, ich bin Sidharth. Ich arbeite mit Java und Spring Boot auf der einen und React und TypeScript auf der anderen Seite — und forsche zu autonomen Agenten und Crowd-Simulation. M.Sc. Informatik, TU Clausthal.",
  } as L,
  noWebgl: {
    en: "This browser can't give the page a WebGL context, so the hall is showing as a flat sketch and the controls are hidden. The full model is on the project page, and in the thesis.",
    de: "Dieser Browser stellt keinen WebGL-Kontext bereit, daher erscheint der Saal als flache Skizze und die Regler sind ausgeblendet. Das vollständige Modell findet sich auf der Projektseite und in der Arbeit.",
  } as L,
  ctaWork: { en: "See the work", de: "Projekte ansehen" } as L,
  ctaMail: { en: "Email me", de: "E-Mail schreiben" } as L,
  telemetry: {
    inside: { en: "still inside", de: "noch drinnen" } as L,
    clearance: { en: "clearance", de: "Räumzeit" } as L,
    flow: { en: "flow · p/s", de: "Fluss · P/s" } as L,
    density: { en: "peak density", de: "Spitzendichte" } as L,
  },
  controls: {
    title: { en: "Parameter sweep", de: "Parameterlauf" } as L,
    hall: { en: "hall layout", de: "Saal-Layout" } as L,
    population: { en: "population", de: "Population" } as L,
    exit: { en: "door width", de: "Türbreite" } as L,
    panic: { en: "panic", de: "Panik" } as L,
    reset: { en: "Reset", de: "Zurücksetzen" } as L,
    legend: { en: "behaviour mix", de: "Verhaltensmix" } as L,
    note: {
      en: "0.5 m cells, 0.1 s ticks, 1.6 persons/s/m door capacity, jamming density 5.4/m² — the constants from the thesis. This browser version is a reduced reimplementation of the NetLogo model; it reproduces the occupancy, door-width and layout effects, not the familiarity one.",
      de: "0,5-m-Zellen, 0,1-s-Ticks, 1,6 Personen/s/m Türkapazität, Stauungsdichte 5,4/m² — die Konstanten aus der Arbeit. Diese Browser-Fassung ist eine reduzierte Nachbildung des NetLogo-Modells; sie reproduziert die Effekte von Belegung, Türbreite und Layout, nicht den der Ortskenntnis.",
    } as L,
  },
  strategies: {
    "follow-others": { en: "follow others", de: "Herdenverhalten" } as L,
    "nearest-exit": { en: "nearest exit", de: "nächster Ausgang" } as L,
    "calm-and-orderly": { en: "calm & orderly", de: "ruhig & geordnet" } as L,
    "panic-rush": { en: "panic rush", de: "Panikflucht" } as L,
  },
};

export const about = {
  title: { en: "About", de: "Über mich" } as L,
  meta: { en: "full-stack developer", de: "Full-Stack-Entwickler" } as L,
  lead: {
    en: "A full-stack developer who turns caffeine into clean code, smooth frontends, and backends built to survive the worst Friday-afternoon edge cases.",
    de: "Full-Stack-Entwickler, der Koffein in sauberen Code verwandelt, in flüssige Frontends und in Backends, die auch die übelsten Freitagnachmittag-Sonderfälle überstehen.",
  } as L,
  body: {
    en: [
      "Hey, I'm Sidharth. I recently finished my Master's in Computer Science at TU Clausthal. Over the years I've built everything from full-stack React and Spring Boot apps to AI-driven crowd simulations — literally working out how 200+ panicked digital humans get out of a lecture hall — and CI/CD pipelines that automate away the boring manual testing.",
      "My tech sandbox: React and TypeScript on the front, Java with Spring Boot, Python and SQL behind it, all of it in Docker. For breaking things on purpose there's Selenium, TestNG, Appium and JMeter, plus pipelines that catch bugs before users do.",
      "Nerdy side quests: autonomous AI agents, crowd simulations, gaming, and cybersecurity. When I'm not debugging code or running simulations you'll probably find me out on a bike or behind a camera.",
    ],
    de: [
      "Hi, ich bin Sidharth. Ich habe gerade meinen Master in Informatik an der TU Clausthal abgeschlossen. In den letzten Jahren habe ich alles gebaut: Full-Stack-Anwendungen mit React und Spring Boot, KI-gestützte Menschenmengen-Simulationen — konkret die Frage, wie 200+ panische digitale Menschen aus einem Hörsaal kommen — und CI/CD-Pipelines, die das langweilige manuelle Testen wegautomatisieren.",
      "Mein Werkzeugkasten: vorne React und TypeScript, dahinter Java mit Spring Boot, Python und SQL, alles in Docker. Zum absichtlichen Kaputtmachen: Selenium, TestNG, Appium und JMeter, dazu Pipelines, die Fehler vor den Nutzern finden.",
      "Nerdige Nebenquests: autonome KI-Agenten, Crowd-Simulationen, Gaming und Cybersicherheit. Wenn ich nicht gerade Code debugge oder Simulationen laufen lasse, bin ich meist mit dem Rad oder der Kamera unterwegs.",
    ],
  } as LL,
  facts: [
    {
      k: { en: "education", de: "Abschluss" },
      v: { en: "M.Sc. Computer Science — TU Clausthal, 2025", de: "M.Sc. Informatik — TU Clausthal, 2025" },
    },
    {
      k: { en: "certified", de: "Zertifikate" },
      v: { en: "Ethical Hacker · Intro to Cybersecurity (Cisco)", de: "Ethical Hacker · Intro to Cybersecurity (Cisco)" },
    },
    {
      k: { en: "off the clock", de: "Feierabend" },
      v: { en: "Cycling, photography, gaming", de: "Radfahren, Fotografie, Gaming" },
    },
  ] as { k: L; v: L }[],
};

export const skills = {
  title: { en: "What I work with", de: "Womit ich arbeite" } as L,
  meta: {
    en: "grouped by what it's for, not by hype",
    de: "gruppiert nach Zweck, nicht nach Hype",
  } as L,
  groups: [
    {
      name: { en: "Backend", de: "Backend" } as L,
      note: { en: "where most of my hours go", de: "hier verbringe ich die meiste Zeit" } as L,
      items: ["Java 17", "Spring Boot 3", "Spring Security", "Spring Data JPA", "REST APIs", "Thymeleaf", "JDBC", "Python", "C++"],
    },
    {
      name: { en: "Frontend", de: "Frontend" } as L,
      note: { en: "typed, decoupled, no surprises", de: "typisiert, entkoppelt, ohne Überraschungen" } as L,
      items: ["React 19", "TypeScript", "JavaScript", "Angular", "Vite", "React Router", "Tailwind", "HTML5", "CSS3"],
    },
    {
      name: { en: "Data & persistence", de: "Daten & Persistenz" } as L,
      note: { en: "schemas that survive contact with users", de: "Schemata, die den Nutzerkontakt überleben" } as L,
      items: ["PostgreSQL", "MySQL", "MS SQL Server", "SQL", "Pandas", "NumPy", "Matplotlib", "Jupyter"],
    },
    {
      name: { en: "Agents & simulation", de: "Agenten & Simulation" } as L,
      note: { en: "the research side", de: "die Forschungsseite" } as L,
      items: ["NetLogo", "BehaviorSpace", "GOAL", "BDI architecture", "Multi-agent systems", "Agent-based modelling"],
    },
    {
      name: { en: "Testing & QA", de: "Testing & QA" } as L,
      note: { en: "150+ regression tests automated", de: "150+ Regressionstests automatisiert" } as L,
      items: ["Selenium WebDriver", "Appium", "JUnit 5", "TestNG", "Mockito", "Vitest", "React Testing Library", "JMeter"],
    },
    {
      name: { en: "Build & ship", de: "Build & Deployment" } as L,
      note: { en: "feedback in under two hours", de: "Feedback in unter zwei Stunden" } as L,
      items: ["Git", "Docker", "GitHub Actions", "Jenkins", "GitLab CI", "Maven", "Linux", "Agile · Scrum · TDD"],
    },
  ],
};

export const experience = {
  title: { en: "The route here", de: "Der Weg hierher" } as L,
  meta: { en: "2011 → today", de: "2011 → heute" } as L,
  rows: [
    {
      kind: "edu" as const,
      when: "2021 — 2025",
      place: { en: "Clausthal, DE", de: "Clausthal, DE" } as L,
      role: { en: "M.Sc. Computer Science", de: "M.Sc. Informatik" } as L,
      org: "Technische Universität Clausthal",
      points: {
        en: [
          "Specialised in multi-agent systems, agent-oriented programming and simulation.",
          "Thesis on emergency evacuation dynamics; project work on BDI agents in GOAL for a MASSim exploration scenario.",
        ],
        de: [
          "Schwerpunkt Multiagentensysteme, agentenorientierte Programmierung und Simulation.",
          "Masterarbeit zur Evakuierungsdynamik; Projektarbeit zu BDI-Agenten in GOAL für ein MASSim-Erkundungsszenario.",
        ],
      } as LL,
    },
    {
      kind: "job" as const,
      when: "12.2018 — 03.2019",
      place: { en: "Kerala, IN", de: "Kerala, IN" } as L,
      role: { en: "Test Automation Engineer", de: "Test Automation Engineer" } as L,
      org: { en: "Rogersoft Technologies — internship", de: "Rogersoft Technologies — Praktikum" } as L,
      points: {
        en: [
          "Automated 150+ web regression tests with Selenium and TestNG, cutting cycle time by 40%.",
          "Built mobile automation with Appium reaching 85% coverage across iOS and Android.",
          "Wired suites into Jenkins, GitLab CI and GitHub Actions — feedback dropped from days to under two hours.",
          "Load-tested 5,000+ virtual users in JMeter and fixed three critical bottlenecks.",
        ],
        de: [
          "150+ Web-Regressionstests mit Selenium und TestNG automatisiert, Durchlaufzeit um 40 % reduziert.",
          "Mobile Automatisierung mit Appium aufgebaut, 85 % Abdeckung auf iOS und Android.",
          "Testsuiten in Jenkins, GitLab CI und GitHub Actions integriert — Feedback von Tagen auf unter zwei Stunden.",
          "Lasttests mit 5.000+ virtuellen Nutzern in JMeter, drei kritische Engpässe behoben.",
        ],
      } as LL,
    },
    {
      kind: "job" as const,
      when: "11.2015 — 11.2018",
      place: { en: "Kerala, IN", de: "Kerala, IN" } as L,
      role: { en: "Software Developer & Academic Coordinator", de: "Softwareentwickler & Studienkoordinator" } as L,
      org: "Matrix Engineering",
      points: {
        en: [
          "Engineered full-lifecycle Java applications (Core Java, JDBC, MySQL) automating grading, attendance and student records.",
          "Wrote backend business logic and stored procedures for result generation and performance tracking.",
          "Mentored students in Java, OOP, data structures, algorithms, SQL and Servlets/JSP; wrote the exercises and the evaluation framework.",
          "Ran scheduling and curriculum operations across five departments.",
        ],
        de: [
          "Java-Anwendungen über den gesamten Lebenszyklus entwickelt (Core Java, JDBC, MySQL) — Noten, Anwesenheit und Studierendendaten automatisiert.",
          "Backend-Geschäftslogik und Stored Procedures für Notenermittlung und Leistungsauswertung geschrieben.",
          "Studierende in Java, OOP, Datenstrukturen, Algorithmen, SQL und Servlets/JSP betreut; Übungen und Bewertungsraster erstellt.",
          "Stundenplanung und Curriculum-Betrieb über fünf Abteilungen koordiniert.",
        ],
      } as LL,
    },
    {
      kind: "job" as const,
      when: "07.2015 — 10.2015",
      place: { en: "Kerala, IN", de: "Kerala, IN" } as L,
      role: { en: "Full-Stack Developer", de: "Full-Stack-Entwickler" } as L,
      org: { en: "Verbicio Labs — internship", de: "Verbicio Labs — Praktikum" } as L,
      points: {
        en: [
          "Built responsive UI components in HTML5, CSS3 and JavaScript; engagement and cross-browser consistency up 15%.",
          "Designed and tuned relational schemas holding 10,000+ user records.",
          "Closed 30+ cross-stack bugs; the team shipped the MVP a week early.",
        ],
        de: [
          "Responsive UI-Komponenten in HTML5, CSS3 und JavaScript gebaut; Engagement und Browser-Konsistenz um 15 % verbessert.",
          "Relationale Schemata für 10.000+ Nutzerdatensätze entworfen und optimiert.",
          "30+ Bugs über den gesamten Stack behoben; das Team lieferte das MVP eine Woche früher aus.",
        ],
      } as LL,
    },
    {
      kind: "edu" as const,
      when: "2011 — 2015",
      place: { en: "Kerala, IN", de: "Kerala, IN" } as L,
      role: { en: "B.Tech. Computer Science & Engineering", de: "B.Tech. Informatik" } as L,
      org: "MBITS · Mahatma Gandhi University",
      points: { en: [], de: [] } as LL,
    },
  ],
};

export type SimKind = "evac" | "hex" | "grid" | "quiz" | "path" | "stats";

export type Project = {
  slug: string;
  /** Optional. Fill these in and the buttons appear on the project page; leave
   *  them out and nothing is rendered, so there are never any dead links. */
  repo?: string;
  demo?: string;
  sim: SimKind;
  tag: L;
  title: L;
  blurb: L;
  stack: string[];
  metrics: { k: L; v: string }[];
  problem: L;
  approach: LL;
  result: L;
  caption: L;
};

export const projects: Project[] = [
  {
    slug: "evacuation-model",
    repo: "https://github.com/Sidharthkris/emergency-evacuation-simulation",
    sim: "evac",
    tag: {
      en: "Master's thesis · TU Clausthal · submitted 26.09.2025",
      de: "Masterarbeit · TU Clausthal · eingereicht am 26.09.2025",
    },
    title: {
      en: "Agent-based evacuation of university lecture halls",
      de: "Agentenbasierte Evakuierung von Hörsälen",
    },
    blurb: {
      en: "Six hall geometries, four behavioural strategies, and a door that sometimes doesn't open. The model measures who gets out, how fast, and where the crowd jams — over nine thousand runs of it.",
      de: "Sechs Saalgeometrien, vier Verhaltensstrategien und eine Tür, die manchmal verschlossen bleibt. Das Modell misst, wer herauskommt, wie schnell und wo es sich staut — über neuntausend Läufe lang.",
    },
    stack: ["NetLogo", "BehaviorSpace", "Python", "Pandas", "NumPy", "Matplotlib", "Agent-based modelling"],
    metrics: [
      { k: { en: "runs", de: "Läufe" }, v: "9,000+" },
      { k: { en: "hall layouts", de: "Saal-Layouts" }, v: "6" },
      { k: { en: "agents per run", de: "Agenten pro Lauf" }, v: "50–200" },
    ],
    problem: {
      en: "Evacuation planning for lecture halls is done from floor plans and static capacity rules. Those rules say nothing about what two hundred people actually do — that they head for the door they came in by, that a narrow aisle upstream throttles a perfectly adequate exit, or that one blocked door reroutes a crowd that cannot see the alternative.",
      de: "Evakuierungsplanung für Hörsäle beruht auf Grundrissen und statischen Kapazitätsregeln. Diese sagen nichts darüber, was zweihundert Menschen tatsächlich tun — dass sie zur Tür zurückgehen, durch die sie kamen, dass ein schmaler Gang davor eine völlig ausreichende Tür drosselt, oder dass eine blockierte Tür eine Menge umleitet, die die Alternative gar nicht sehen kann.",
    },
    approach: {
      en: [
        "Built the model in NetLogo on a 0.5 m cell grid at 0.1 s per tick, across six real lecture-hall geometries.",
        "Gave every agent its own walking speed, mobility impairment, familiarity and patience, with pre-movement delay drawn from a log-normal distribution to match the right-skewed reaction times reported in the literature.",
        "Implemented four behavioural strategies — follow-others, nearest-exit, calm-and-orderly and panic-rush — plus a mixed population weighted 50/25/15/10.",
        "Modelled movement with a speed–density relationship against a jamming density of 5.4 persons/m², and gated each doorway by a throughput budget of 1.3–1.9 persons per second per metre.",
        "Swept the parameter space over 9,000+ BehaviorSpace runs and analysed the output with Python pipelines.",
      ],
      de: [
        "Modell in NetLogo auf einem 0,5-m-Raster mit 0,1 s pro Tick gebaut, für sechs reale Hörsaalgeometrien.",
        "Jedem Agenten eigene Gehgeschwindigkeit, Mobilitätseinschränkung, Ortskenntnis und Geduld gegeben; die Vorbewegungszeit stammt aus einer Log-Normal-Verteilung passend zu den rechtsschiefen Reaktionszeiten der Literatur.",
        "Vier Verhaltensstrategien umgesetzt — Herdenverhalten, nächster Ausgang, ruhig und geordnet, Panikflucht — plus eine gemischte Population im Verhältnis 50/25/15/10.",
        "Bewegung über eine Geschwindigkeits-Dichte-Beziehung gegen eine Stauungsdichte von 5,4 Personen/m² modelliert; jede Tür durch ein Durchsatzbudget von 1,3–1,9 Personen pro Sekunde und Meter begrenzt.",
        "Parameterraum in über 9.000 BehaviorSpace-Läufen durchfahren und mit Python-Pipelines ausgewertet.",
      ],
    },
    result: {
      en: "Clearance time grows faster than occupancy does, door capacity was the strongest single predictor across the whole sweep, and balanced sightlines behaved like extra capacity — asymmetric exits queue at the visible door regardless of which route is quicker. Widening a feeder aisle improved clearance without touching any doorway, which makes it a retrofit a university can actually afford.",
      de: "Die Räumzeit wächst schneller als die Belegung, die Türkapazität war im gesamten Lauf der stärkste Einzelprädiktor, und ausgewogene Sichtachsen wirkten wie zusätzliche Kapazität — bei asymmetrischen Ausgängen staut es sich an der sichtbaren Tür, unabhängig vom schnelleren Weg. Einen Zubringergang zu verbreitern verbesserte die Räumung, ohne eine Tür anzufassen — eine Nachrüstung, die sich eine Universität leisten kann.",
    },
    caption: { en: "agents converging on a single exit", de: "Agenten strömen zu einem Ausgang" },
  },
  {
    slug: "bdi-agents",
    sim: "hex",
    tag: {
      en: "Master's project · team of three · TU Clausthal, summer 2024",
      de: "Masterprojekt · Dreierteam · TU Clausthal, Sommer 2024",
    },
    title: {
      en: "Cognitive agents exploring an unmapped hex world",
      de: "Kognitive Agenten erkunden eine unbekannte Hex-Welt",
    },
    blurb: {
      en: "Agents that can see three cells in any direction, dropped into a hex grid they have no map of, and asked to find the mountains without walking into a cactus.",
      de: "Agenten mit einer Sichtweite von drei Feldern, ausgesetzt in einem Hexgitter ohne Karte, mit dem Auftrag, die Berge zu finden, ohne in einen Kaktus zu laufen.",
    },
    stack: ["GOAL", "Prolog", "Java", "EIS / MASSim", "BDI", "A* pathfinding"],
    metrics: [
      { k: { en: "team", de: "Team" }, v: "3" },
      { k: { en: "vision radius", de: "Sichtweite" }, v: "3 cells" },
      { k: { en: "agent types", de: "Agententypen" }, v: "2" },
    ],
    problem: {
      en: "The environment is a flat-topped hex grid addressed in cube coordinates, where q + r + s always sums to zero. An agent perceives only three cells around itself: some mountains worth reaching, some cacti that cannot be entered, an oasis here and there. Everything else has to be inferred and remembered, and the belief base has to stay honest as energy drains and inventory changes underneath it.",
      de: "Die Umgebung ist ein Hexgitter mit flacher Oberkante, adressiert in Würfelkoordinaten, wobei q + r + s stets null ergibt. Ein Agent nimmt nur drei Felder um sich herum wahr: einige lohnende Berge, einige nicht betretbare Kakteen, hier und da eine Oase. Alles Übrige muss erschlossen und erinnert werden — und die Wissensbasis muss korrekt bleiben, während Energie und Inventar sich darunter verändern.",
    },
    approach: {
      en: [
        "Wrote the agents in GOAL against the MASSim environment through the EIS interface, in a team of three.",
        "Derived the movement rules for both agent classes over cube coordinates — ground agents step one cell per action, UAVs two.",
        "Implemented A* in Prolog over hex neighbours, with a distance heuristic and mountains and cacti excluded from the successor relation.",
        "Built an init module that turns each percept into a belief and, for mountains and oases, adopts a matching goal.",
        "Built an event module that keeps volatile state — energy, inventory, movement cost, energy drain — current by deleting the stale fact before inserting the new one.",
      ],
      de: [
        "Die Agenten im Dreierteam in GOAL geschrieben, angebunden an die MASSim-Umgebung über die EIS-Schnittstelle.",
        "Die Bewegungsregeln beider Agentenklassen über Würfelkoordinaten hergeleitet — Bodenagenten ziehen ein Feld pro Aktion, UAVs zwei.",
        "A* in Prolog über Hex-Nachbarn implementiert, mit Distanzheuristik; Berge und Kakteen sind aus der Nachfolgerrelation ausgeschlossen.",
        "Ein Init-Modul gebaut, das jedes Perzept in eine Überzeugung überführt und für Berge und Oasen ein passendes Ziel adoptiert.",
        "Ein Event-Modul gebaut, das veränderliche Zustände — Energie, Inventar, Bewegungskosten, Energieverlust — aktuell hält, indem es den alten Fakt löscht, bevor der neue eingefügt wird.",
      ],
    },
    result: {
      en: "Agents that explore and route around obstacles they have only partially seen. The lasting lesson was less about pathfinding than about discipline in the belief base: almost every early bug was a stale fact the agent still trusted. We also rebuilt the whole thing from scratch at the final milestone, which was the right call — and a reminder that with a language this sparsely documented, a working reference implementation beats a clever architecture.",
      de: "Agenten, die erkunden und um Hindernisse navigieren, die sie nur teilweise gesehen haben. Die bleibende Lehre betraf weniger die Pfadsuche als die Disziplin in der Wissensbasis: Fast jeder frühe Fehler war ein veralteter Fakt, dem der Agent noch vertraute. Zum letzten Meilenstein haben wir das Ganze neu aufgebaut — richtig so, und eine Erinnerung daran, dass bei einer so spärlich dokumentierten Sprache eine lauffähige Referenz mehr wert ist als eine kluge Architektur.",
    },
    caption: { en: "A* pathfinding across a hex grid", de: "A*-Pfadsuche über ein Hexgitter" },
  },
  {
    slug: "timetable-planner",
    repo: "https://github.com/Sidharthkris/course-timetable-planner",
    demo: "https://github.com/Sidharthkris/course-timetable-planner-frontend",
    sim: "grid",
    tag: { en: "Full-stack · REST API with two independent clients", de: "Full-Stack · REST-API mit zwei unabhängigen Clients" },
    title: {
      en: "Course timetable planner with conflict detection",
      de: "Stundenplaner mit Konflikterkennung",
    },
    blurb: {
      en: "One rule holds the whole thing up: an instructor or a room can never hold two overlapping entries on the same day. Everything else — the API, the calendar grid, the roles — exists to enforce it.",
      de: "Eine Regel trägt das Ganze: Ein Dozent oder ein Raum kann nie zwei überlappende Einträge am selben Tag haben. Alles Übrige — API, Kalenderraster, Rollen — dient ihrer Durchsetzung.",
    },
    stack: ["Java 17", "Spring Boot 3", "Spring Security 6", "Spring Data JPA", "Thymeleaf", "PostgreSQL", "React 19", "TypeScript", "Vite", "Docker", "JUnit 5", "Mockito"],
    metrics: [
      { k: { en: "clients", de: "Clients" }, v: "2" },
      { k: { en: "roles", de: "Rollen" }, v: "2" },
      { k: { en: "test levels", de: "Teststufen" }, v: "4" },
    ],
    problem: {
      en: "Timetables get assembled in spreadsheets, so collisions surface after publication. And when the rules live in the controller, every new client re-implements them — or quietly skips one.",
      de: "Stundenpläne entstehen in Tabellen, deshalb fallen Kollisionen erst nach der Veröffentlichung auf. Und wenn die Regeln im Controller stehen, implementiert jeder neue Client sie neu — oder lässt stillschweigend eine aus.",
    },
    approach: {
      en: [
        "Put conflict detection behind POST /api/schedule-entries, returning 409 with the exact entries that clashed, plus a dry-run check-conflicts endpoint for asking without committing.",
        "Enforced role-based access with @PreAuthorize on the service layer rather than the controllers, so the REST API and the server-rendered UI share one rule that cannot be routed around.",
        "Built the weekly grid so each cell holds a list rather than one entry — two courses can legitimately run at once in different rooms — and anchored entries to their start hour instead of using rowspan, which cannot represent overlapping durations correctly.",
        "Kept the grid builder free of Spring and JPA, so it is pure java.time arithmetic over DTOs and can be unit tested on its own.",
        "Wrote a second, independent React and TypeScript client against the same API, to prove the backend is the reusable part rather than something wired to one UI.",
      ],
      de: [
        "Konflikterkennung hinter POST /api/schedule-entries gelegt: 409 mit genau den kollidierenden Einträgen, dazu ein check-conflicts-Endpunkt zum Prüfen ohne Speichern.",
        "Rollenrechte mit @PreAuthorize auf der Service-Schicht durchgesetzt statt in den Controllern — so teilen REST-API und servergerenderte Oberfläche eine Regel, die sich nicht umgehen lässt.",
        "Das Wochenraster so gebaut, dass jede Zelle eine Liste hält — zwei Kurse dürfen gleichzeitig in verschiedenen Räumen laufen — und Einträge an ihrer Startstunde verankert statt per rowspan, das überlappende Dauern nicht korrekt abbilden kann.",
        "Den Grid-Builder frei von Spring und JPA gehalten: reine java.time-Arithmetik über DTOs, eigenständig testbar.",
        "Einen zweiten, unabhängigen React-TypeScript-Client gegen dieselbe API gebaut — Beleg dafür, dass das Backend der wiederverwendbare Teil ist.",
      ],
    },
    result: {
      en: "Invalid schedules cannot be persisted, and the client explains exactly what they clashed with instead of showing a generic error. Tests sit at four levels: the overlap algorithm alone, the calendar-grid logic with no Spring at all, the conflict service under Mockito, and a full MockMvc pass that proves an instructor gets 403 on every write. Entries outside the displayed hours fall into a table below the grid rather than disappearing.",
      de: "Ungültige Pläne lassen sich nicht speichern, und der Client nennt genau den kollidierenden Eintrag statt einer generischen Fehlermeldung. Getestet wird auf vier Ebenen: der Überlappungsalgorithmus allein, die Kalenderlogik ganz ohne Spring, der Konfliktdienst mit Mockito und ein vollständiger MockMvc-Durchlauf, der belegt, dass ein Dozent bei jedem Schreibzugriff 403 erhält. Einträge außerhalb der angezeigten Stunden landen in einer Tabelle unter dem Raster, statt zu verschwinden.",
    },
    caption: { en: "clashes flagged before anything is saved", de: "Konflikte werden vor dem Speichern gemeldet" },
  },
  {
    slug: "quiz-engine",
    repo: "https://github.com/Sidharthkris/quiz-assessment-engine",
    sim: "quiz",
    tag: { en: "Desktop application · design-patterns study", de: "Desktop-Anwendung · Entwurfsmuster-Studie" },
    title: { en: "Quiz assessment engine", de: "Prüfungs-Engine für Quizze" },
    blurb: {
      en: "An event-driven Java engine built to prove a point: question authoring, scoring rules, timing and storage can stay genuinely independent of one another.",
      de: "Eine ereignisgesteuerte Java-Engine, die eines zeigen soll: Fragenerstellung, Bewertungsregeln, Zeitsteuerung und Speicherung können wirklich unabhängig voneinander bleiben.",
    },
    stack: ["Java 17", "Swing", "Jackson", "JUnit 5", "Maven", "GoF patterns"],
    metrics: [
      { k: { en: "GoF patterns", de: "GoF-Muster" }, v: "4" },
      { k: { en: "question bank", de: "Fragenpool" }, v: "120+" },
      { k: { en: "coupling", de: "Kopplung" }, v: "event-driven" },
    ],
    problem: {
      en: "Assessment tools rot in a predictable way: one class ends up owning the question model, the timer, the scoring rules and the file format, and adding a new question type means touching all four.",
      de: "Prüfungswerkzeuge verfallen vorhersehbar: Eine Klasse besitzt am Ende Fragemodell, Timer, Bewertungsregeln und Dateiformat — ein neuer Fragetyp erzwingt Änderungen an allen vieren.",
    },
    approach: {
      en: [
        "Used Factory, Builder, Strategy and Observer so the modules communicate through events rather than holding references to each other.",
        "Made scoring rules interchangeable at runtime, and progress tracking a subscriber rather than a caller.",
        "Built a Swing interface with live countdown timers over a self-validating bank of 120+ Java questions.",
        "Persisted with polymorphic JSON through Jackson, so a new question type serialises without a schema change.",
      ],
      de: [
        "Factory, Builder, Strategy und Observer eingesetzt, damit die Module über Ereignisse kommunizieren, statt einander zu referenzieren.",
        "Bewertungsregeln zur Laufzeit austauschbar gemacht; die Fortschrittsverfolgung ist Abonnent statt Aufrufer.",
        "Eine Swing-Oberfläche mit laufenden Countdown-Timern über einem selbstprüfenden Pool von 120+ Java-Fragen gebaut.",
        "Mit polymorphem JSON über Jackson persistiert, sodass ein neuer Fragetyp ohne Schemaänderung serialisiert.",
      ],
    },
    result: {
      en: "Adding a question type is one Strategy implementation and a registration — timing, scoring and storage are untouched. Covered by a JUnit 5 suite.",
      de: "Ein neuer Fragetyp ist eine Strategy-Implementierung plus Registrierung — Timer, Bewertung und Speicherung bleiben unberührt. Abgesichert durch eine JUnit-5-Suite.",
    },
    caption: { en: "timed session, randomised item pool", de: "Sitzung auf Zeit, zufälliger Fragenpool" },
  },
  {
    slug: "pathfinding-visualizer",
    repo: "https://github.com/Sidharthkris/pathfinding-visualizer",
    sim: "path",
    tag: { en: "Interactive web tool", de: "Interaktives Web-Werkzeug" },
    title: { en: "Pathfinding visualizer", de: "Pfadsuche sichtbar gemacht" },
    blurb: {
      en: "A browser tool that shows search algorithms thinking: the frontier spreading outward across a grid, and the route that survives once it reaches the goal.",
      de: "Ein Browser-Werkzeug, das Suchalgorithmen beim Denken zeigt: die Front, die sich über ein Raster ausbreitet, und die Route, die übrig bleibt, sobald sie das Ziel erreicht.",
    },
    stack: ["JavaScript", "HTML5", "CSS3", "Canvas API", "Algorithms"],
    metrics: [
      { k: { en: "runs in", de: "läuft in" }, v: "browser" },
      { k: { en: "dependencies", de: "Abhängigkeiten" }, v: "none" },
      { k: { en: "grid", de: "Raster" }, v: "editable" },
    ],
    problem: {
      en: "Pathfinding is taught as pseudocode, which hides the part that actually matters: how much of the grid a search touches before it finds anything. Two algorithms can return the same route having done wildly different amounts of work.",
      de: "Pfadsuche wird als Pseudocode gelehrt, was genau das verbirgt, worauf es ankommt: wie viel des Rasters eine Suche berührt, bevor sie etwas findet. Zwei Algorithmen können dieselbe Route liefern und dabei völlig unterschiedlich viel Arbeit leisten.",
    },
    approach: {
      en: [
        "Rendered the grid and the search frontier to a canvas, stepping the algorithm frame by frame so the expansion is visible rather than instantaneous.",
        "Let the grid be edited directly — walls drawn in, endpoints moved — so the same algorithm can be watched against a maze and against open ground.",
        "Kept it dependency-free: plain JavaScript and the Canvas API, so it loads as a static page.",
      ],
      de: [
        "Raster und Suchfront auf ein Canvas gezeichnet und den Algorithmus Bild für Bild ausgeführt, damit die Ausbreitung sichtbar wird statt augenblicklich zu geschehen.",
        "Das Raster direkt editierbar gemacht — Wände zeichnen, Start und Ziel verschieben — damit derselbe Algorithmus im Labyrinth und auf freier Fläche beobachtet werden kann.",
        "Ohne Abhängigkeiten gehalten: reines JavaScript und die Canvas-API, lädt als statische Seite.",
      ],
    },
    result: {
      en: "The visible difference between algorithms is the shape of the explored region, not the route. Watching one flood a room while another drives a narrow corridor toward the goal makes the role of the heuristic obvious in a way pseudocode does not.",
      de: "Der sichtbare Unterschied zwischen Algorithmen liegt in der Form des erkundeten Bereichs, nicht in der Route. Zu sehen, wie der eine einen Raum flutet, während der andere einen schmalen Korridor zum Ziel treibt, macht die Rolle der Heuristik deutlicher als jeder Pseudocode.",
    },
    caption: { en: "the frontier expanding toward the goal", de: "die Suchfront breitet sich zum Ziel aus" },
  },
  {
    slug: "exam-result-processor",
    repo: "https://github.com/Sidharthkris/exam-result-processor",
    sim: "stats",
    tag: { en: "Command-line pipeline · reporting", de: "Kommandozeilen-Pipeline · Auswertung" },
    title: { en: "Exam result batch processor", de: "Stapelverarbeitung von Prüfungsergebnissen" },
    blurb: {
      en: "A Java pipeline that takes raw exam data and hands back the two artefacts a department actually asks for: a multi-sheet workbook and a formatted summary.",
      de: "Eine Java-Pipeline, die aus Rohdaten genau die zwei Artefakte erzeugt, nach denen ein Fachbereich tatsächlich fragt: eine mehrblättrige Arbeitsmappe und eine formatierte Zusammenfassung.",
    },
    stack: ["Java 17", "Stream API", "OpenCSV", "Apache POI", "Apache PDFBox", "JUnit 5"],
    metrics: [
      { k: { en: "outputs", de: "Ausgaben" }, v: "XLSX + PDF" },
      { k: { en: "input", de: "Eingabe" }, v: "CSV batches" },
      { k: { en: "interface", de: "Schnittstelle" }, v: "CLI" },
    ],
    problem: {
      en: "Consolidating exam results by hand is where grading mistakes are made — the arithmetic is easy, but it is repeated across cohorts, under deadline, by someone reading from one spreadsheet into another.",
      de: "Beim manuellen Zusammenführen von Prüfungsergebnissen entstehen die Fehler — die Rechnung ist einfach, aber sie wird über Kohorten hinweg, unter Zeitdruck und mit Blick von einer Tabelle in die nächste wiederholt.",
    },
    approach: {
      en: [
        "Ingested batch CSV exports with OpenCSV and computed the distribution statistics with the Stream API — mean, median, rank and grade boundaries.",
        "Generated multi-sheet Excel workbooks with Apache POI, so each cohort lands on its own sheet with the summary alongside.",
        "Rendered formatted PDF summaries with PDFBox for the version that gets circulated rather than edited.",
        "Kept it a command-line tool, so it fits into a script or a scheduled job rather than needing someone at a screen.",
      ],
      de: [
        "CSV-Stapelexporte mit OpenCSV eingelesen und die Verteilungsstatistik mit der Stream-API berechnet — Mittelwert, Median, Rang und Notengrenzen.",
        "Mehrblättrige Excel-Arbeitsmappen mit Apache POI erzeugt, sodass jede Kohorte ein eigenes Blatt samt Zusammenfassung erhält.",
        "Formatierte PDF-Zusammenfassungen mit PDFBox gerendert — für die Fassung, die verteilt und nicht bearbeitet wird.",
        "Als Kommandozeilenwerkzeug gehalten, damit es in ein Skript oder einen geplanten Job passt statt jemanden am Bildschirm zu binden.",
      ],
    },
    result: {
      en: "The same input produces the same workbook and the same PDF every time, which is the whole point — the reporting step stops being a place where errors are introduced. This one grew directly out of doing the job by hand for five departments.",
      de: "Dieselbe Eingabe erzeugt jedes Mal dieselbe Arbeitsmappe und dasselbe PDF — genau darum geht es: Der Auswertungsschritt hört auf, eine Fehlerquelle zu sein. Dieses Projekt ist direkt daraus entstanden, die Arbeit für fünf Abteilungen von Hand gemacht zu haben.",
    },
    caption: { en: "grade distribution against the pass boundary", de: "Notenverteilung gegen die Bestehensgrenze" },
  },
];

export const contact = {
  title: { en: "Get in touch", de: "Kontakt" } as L,
  meta: { en: "replies within a day", de: "Antwort innerhalb eines Tages" } as L,
  ctaLines: { en: ["Let's build", "something."], de: ["Lass uns etwas", "bauen."] } as LL,
  body: {
    en: "Let's connect and chat about tech, cool projects, or the best cycling trails.",
    de: "Lass uns über Technik, spannende Projekte oder die besten Radstrecken sprechen.",
  } as L,
  card: {
    label: { en: "Email", de: "E-Mail" } as L,
    copy: { en: "Copy", de: "Kopieren" } as L,
    copied: { en: "Copied", de: "Kopiert" } as L,
    write: { en: "Write to me", de: "Schreiben" } as L,
    elsewhere: { en: "Elsewhere", de: "Anderswo" } as L,
    rows: [
      { k: { en: "reply time", de: "Antwortzeit" }, v: { en: "Usually within a day", de: "Meist innerhalb eines Tages" } },
    ] as { k: L; v: L }[],
  },
  footerCredit: {
    en: "Made with care by",
    de: "Mit Sorgfalt gebaut von",
  } as L,
  visitors: { en: "visits", de: "Besuche" } as L,
  toTop: { en: "Back to top", de: "Nach oben" } as L,
  footer: {
    en: "React 19 · TypeScript · Three.js · Tailwind. The crowd up top is a live model, not a video.",
    de: "React 19 · TypeScript · Three.js · Tailwind. Die Menge oben ist ein Live-Modell, kein Video.",
  } as L,
};
