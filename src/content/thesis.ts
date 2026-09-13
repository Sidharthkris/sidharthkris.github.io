import chartBehaviour from "../assets/thesis/chart-behaviour.webp";
import chartCongestion from "../assets/thesis/chart-congestion.webp";
import chartExitWidth from "../assets/thesis/chart-exitwidth.webp";
import chartFamiliarity from "../assets/thesis/chart-familiarity.webp";
import chartLayout from "../assets/thesis/chart-layout.webp";
import chartPopulation from "../assets/thesis/chart-population.webp";
import layoutCenterAisle from "../assets/thesis/layout-center-aisle.webp";
import layoutCenterOnly from "../assets/thesis/layout-center-only.webp";
import layoutSideExits from "../assets/thesis/layout-side-exits.webp";
import layoutTiered from "../assets/thesis/layout-tiered.webp";
import layoutTraditional from "../assets/thesis/layout-traditional.webp";
import layoutWide from "../assets/thesis/layout-wide.webp";
import modelInterface from "../assets/thesis/model-interface.webp";
import type { L } from "./site";

export type Figure = { src: string; title: L; caption: L };

export const thesisMeta = {
  title: {
    en: "Agent-Based Simulation of Emergency Evacuation in University Lecture Halls",
    de: "Agentenbasierte Simulation der Notfallevakuierung in Hörsälen",
  } as L,
  submitted: "26.09.2025",
  institute: {
    en: "Institute of Computer Science, Clausthal University of Technology",
    de: "Institut für Informatik, Technische Universität Clausthal",
  } as L,
  supervisors: ["Prof. Dr. Robert Bredereck", "Dr. Tobias Ahlbrecht"],
};

/** The six hall geometries implemented in the NetLogo model. */
export const hallLayouts: Figure[] = [
  {
    src: layoutTraditional,
    title: { en: "Traditional", de: "Traditionell" },
    caption: {
      en: "One rectangular seating block with two doors at diagonally opposite corners.",
      de: "Ein rechteckiger Sitzblock mit zwei diagonal gegenüberliegenden Türen.",
    },
  },
  {
    src: layoutCenterAisle,
    title: { en: "Centre + side aisles", de: "Mittel- und Seitengänge" },
    caption: {
      en: "A wide central aisle bisects the seating, with two wall aisles and three exits.",
      de: "Ein breiter Mittelgang teilt die Bestuhlung, dazu zwei Wandgänge und drei Ausgänge.",
    },
  },
  {
    src: layoutCenterOnly,
    title: { en: "Centre aisle only", de: "Nur Mittelgang" },
    caption: {
      en: "A narrower hall funnelling everyone toward one wide rear exit, with a front-left door in reserve.",
      de: "Ein schmalerer Saal, der alle zu einem breiten hinteren Ausgang führt; vorne links eine Reservetür.",
    },
  },
  {
    src: layoutTiered,
    title: { en: "Tiered", de: "Ansteigend" },
    caption: {
      en: "Sloped floor with a tier level per row; ascending costs speed, descending gains it.",
      de: "Geneigter Boden mit Stufe je Reihe; aufwärts kostet Tempo, abwärts bringt Tempo.",
    },
  },
  {
    src: layoutSideExits,
    title: { en: "Side exits", de: "Seitliche Ausgänge" },
    caption: {
      en: "Doors in the middle of the long walls and no central aisle, so everyone moves sideways first.",
      de: "Türen mitten in den Längswänden und kein Mittelgang — alle müssen zuerst seitwärts.",
    },
  },
  {
    src: layoutWide,
    title: { en: "Wide auditorium", de: "Weites Auditorium" },
    caption: {
      en: "The largest space: three seating sections, two aisles and four exits.",
      de: "Der größte Raum: drei Sitzblöcke, zwei Gänge und vier Ausgänge.",
    },
  },
];

/** Result figures from the 9,000+ BehaviorSpace runs. */
export const resultFigures: Figure[] = [
  {
    src: chartPopulation,
    title: { en: "Clearance time vs. occupancy", de: "Räumzeit vs. Belegung" },
    caption: {
      en: "Evacuation time rises faster than occupancy does. The curve steepens as density brings congestion into play.",
      de: "Die Räumzeit steigt schneller als die Belegung. Die Kurve wird steiler, sobald die Dichte Staus erzeugt.",
    },
  },
  {
    src: chartLayout,
    title: { en: "Clearance time by layout", de: "Räumzeit nach Layout" },
    caption: {
      en: "Median and spread per hall geometry. Some layouts are not just slower but far less predictable.",
      de: "Median und Streuung je Saalgeometrie. Manche Layouts sind nicht nur langsamer, sondern deutlich unberechenbarer.",
    },
  },
  {
    src: chartBehaviour,
    title: { en: "Clearance time by behaviour", de: "Räumzeit nach Verhalten" },
    caption: {
      en: "Behavioural strategy shifts both the median and the length of the tail.",
      de: "Die Verhaltensstrategie verschiebt sowohl den Median als auch die Länge des Ausläufers.",
    },
  },
  {
    src: chartExitWidth,
    title: { en: "Clearance time vs. door width", de: "Räumzeit vs. Türbreite" },
    caption: {
      en: "The clearest negative relationship in the dataset: wider doors, faster clearance.",
      de: "Der deutlichste negative Zusammenhang im Datensatz: breitere Türen, schnellere Räumung.",
    },
  },
  {
    src: chartFamiliarity,
    title: { en: "Clearance time vs. familiarity", de: "Räumzeit vs. Ortskenntnis" },
    caption: {
      en: "Crowds that know the building clear faster — they walk to exits instead of searching for them.",
      de: "Wer das Gebäude kennt, räumt schneller — man geht zum Ausgang, statt ihn zu suchen.",
    },
  },
  {
    src: chartCongestion,
    title: { en: "Congestion events by behaviour", de: "Stauereignisse nach Verhalten" },
    caption: {
      en: "Which behaviours actually cause the jams, rather than merely being slowed by them.",
      de: "Welche Verhaltensweisen die Staus verursachen — statt nur von ihnen ausgebremst zu werden.",
    },
  },
];

export const modelFigure: Figure = {
  src: modelInterface,
  title: { en: "The NetLogo model", de: "Das NetLogo-Modell" },
  caption: {
    en: "The simulation interface: layout chooser, population and behaviour controls, live congestion readouts.",
    de: "Die Simulationsoberfläche: Layout-Auswahl, Regler für Population und Verhalten, Live-Stauanzeigen.",
  },
};

/** Findings as stated in the thesis, kept separate from the browser model. */
export const findings: { claim: L; detail: L }[] = [
  {
    claim: { en: "Congestion scales worse than occupancy", de: "Staus skalieren schlechter als die Belegung" },
    detail: {
      en: "Clearance time grows non-linearly with the number of occupants — the marginal student costs more time than the one before.",
      de: "Die Räumzeit wächst nichtlinear mit der Personenzahl — jede weitere Person kostet mehr Zeit als die vorige.",
    },
  },
  {
    claim: { en: "Door capacity dominates", de: "Die Türkapazität dominiert" },
    detail: {
      en: "Exit width and capacity per metre were the strongest single predictors of clearance time across the whole parameter space.",
      de: "Ausgangsbreite und Kapazität pro Meter waren im gesamten Parameterraum die stärksten Einzelprädiktoren.",
    },
  },
  {
    claim: { en: "Balanced sightlines are evacuation capacity", de: "Ausgewogene Sichtachsen sind Räumkapazität" },
    detail: {
      en: "Symmetrical, intervisible exits spread the load evenly. Break that symmetry and queues build at the salient door regardless of which route is actually quicker.",
      de: "Symmetrische, gegenseitig sichtbare Ausgänge verteilen die Last. Bricht die Symmetrie, staut es sich an der auffälligen Tür — unabhängig davon, welcher Weg schneller wäre.",
    },
  },
  {
    claim: { en: "Feeder aisles throttle good doors", de: "Zubringergänge drosseln gute Türen" },
    detail: {
      en: "A narrow aisle upstream caps the arrival rate at an otherwise adequate exit. Widening the aisle improved clearance without touching the doors — a cheap retrofit.",
      de: "Ein schmaler Gang davor begrenzt die Ankunftsrate an einer eigentlich ausreichenden Tür. Den Gang zu verbreitern verbesserte die Räumzeit, ohne die Türen anzufassen — eine günstige Nachrüstung.",
    },
  },
  {
    claim: { en: "Sustained panic costs more than initial panic", de: "Anhaltende Panik kostet mehr als anfängliche" },
    detail: {
      en: "Starting panic level barely correlated with clearance time. Average panic across the run did — it compresses spacing at exactly the points that can least afford it.",
      de: "Die anfängliche Panik korrelierte kaum mit der Räumzeit. Die durchschnittliche Panik über den Lauf schon — sie verdichtet die Abstände genau dort, wo es am wenigsten verträglich ist.",
    },
  },
  {
    claim: { en: "Familiarity buys time", de: "Ortskenntnis spart Zeit" },
    detail: {
      en: "A higher share of occupants who knew the hall meant shorter clearance times: they route to a door instead of searching for one.",
      de: "Ein höherer Anteil ortskundiger Personen bedeutete kürzere Räumzeiten: Sie steuern eine Tür an, statt eine zu suchen.",
    },
  },
];
