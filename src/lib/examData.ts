// ─────────────────────────────────────────────
//  Dummy exam data for Phase 2
// ─────────────────────────────────────────────

export interface Answer {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  number: number;
  text: string;
  passage?: string; // for reading – reference passage id
  answers: Answer[];
  correctAnswerId: string;
  explanation?: string;
}

export interface Passage {
  id: string;
  title: string;
  body: string;
  questionIds: string[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  section: "reading";
  durationMinutes: number;
  passages: Passage[];
  questions: Question[];
  status: "upcoming" | "active" | "completed";
  scheduledDate: string;
  maxScore: number;
}

// ─── Passages ────────────────────────────────

const PASSAGE_1: Passage = {
  id: "p1",
  title: "The Origins of Agriculture",
  questionIds: ["q1", "q2", "q3", "q4", "q5"],
  body: `
The shift from hunting and gathering to farming—known as the Neolithic Revolution—occurred independently in several regions of the world beginning around 10,000 BCE. Archaeologists and anthropologists have long debated what drove early human societies to transition from a mobile, hunter-gatherer lifestyle to one based on settled agriculture. Several competing theories attempt to explain this pivotal change.

One prominent explanation is the climate change hypothesis. At the end of the last Ice Age, rising temperatures and changing precipitation patterns made plant cultivation more viable. Warmer climates allowed certain grasses, the ancestors of modern wheat and barley, to thrive across the Near East in a region often called the Fertile Crescent. As wild grain became more abundant, early humans began to settle near reliable food sources and eventually learned to cultivate them deliberately.

Another theory emphasizes population pressure. As hunter-gatherer communities grew larger, the local environment could no longer support them through foraging alone. Agriculture offered a way to produce more food per unit of land, enabling denser populations. Supporters of this view point to archaeological evidence showing that the earliest farming settlements appear in regions where population density was relatively high.

A third perspective focuses on social and ritual motivations. Some archaeologists argue that the construction of large ceremonial sites—such as Göbekli Tepe in modern-day Turkey, which predates agriculture by several centuries—suggests that social complexity and organized religion may have driven, rather than resulted from, the agricultural transition. The need to feed large numbers of people gathering for rituals may have incentivized food production.

Regardless of the cause, the consequences of agriculture were profound. Settled farming communities developed new technologies such as pottery, irrigation systems, and the wheel. Social hierarchies emerged as surplus food allowed some individuals to specialize in crafts, governance, or religion rather than food production. These developments laid the groundwork for the rise of the world's first civilizations along river valleys such as the Tigris-Euphrates, the Nile, and the Indus.
  `.trim(),
};

const PASSAGE_2: Passage = {
  id: "p2",
  title: "Deep-Sea Exploration and Its Challenges",
  questionIds: ["q6", "q7", "q8", "q9", "q10"],
  body: `
The deep ocean—defined as water below 200 meters—covers more than 65 percent of the Earth's surface, yet it remains one of the least explored environments on the planet. Despite advances in technology, humans have visited the deepest point of the ocean, the Challenger Deep in the Mariana Trench, only a handful of times. Scientists estimate that less than 20 percent of the ocean floor has been mapped in high resolution.

The challenges of deep-sea exploration are immense. Pressure increases by approximately one atmosphere for every ten meters of depth, meaning that at the bottom of the Mariana Trench—nearly 11,000 meters below the surface—the pressure is over a thousand times greater than at sea level. Vehicles and instruments must be built from specially engineered materials capable of withstanding these crushing forces without implosion.

Light disappears almost entirely below 200 meters, creating what scientists call the "twilight zone," and below 1,000 meters total darkness prevails. In this aphotic zone, organisms have evolved remarkable adaptations: bioluminescence to communicate and attract prey, oversized eyes or the complete absence of eyes, and metabolisms calibrated to survive on scarce nutrients that drift down from surface waters in what researchers call "marine snow."

Despite the difficulties, the deep sea holds scientific and economic importance. Hydrothermal vents, first discovered in 1977, host ecosystems that derive energy from chemical reactions rather than sunlight—a concept that has reshaped our understanding of life's requirements and expanded the range of environments where life might exist elsewhere in the solar system. Additionally, the deep seafloor contains significant mineral deposits, including polymetallic nodules rich in manganese, cobalt, and nickel, making it a subject of growing interest for resource extraction, though at considerable environmental risk.

Modern exploration relies on remotely operated vehicles (ROVs) and autonomous underwater vehicles (AUVs), which can transmit video and sensor data to researchers aboard surface ships. Advances in artificial intelligence are now enabling these vehicles to make real-time decisions without human guidance, dramatically increasing the efficiency of deep-sea surveys.
  `.trim(),
};

const PASSAGE_3: Passage = {
  id: "p3",
  title: "The Psychology of Decision-Making",
  questionIds: ["q11", "q12", "q13", "q14"],
  body: `
For much of the twentieth century, economists and psychologists assumed that human decision-making was fundamentally rational: given complete information, people would evaluate options systematically and choose whatever maximized their personal utility. This model, known as the rational actor model, influenced everything from economic policy to legal theory. However, research beginning in the 1970s—most notably by psychologists Daniel Kahneman and Amos Tversky—demonstrated that human judgment is systematically shaped by cognitive biases and mental shortcuts called heuristics.

Kahneman later popularized a framework distinguishing two modes of thought: System 1, which is fast, automatic, and emotional; and System 2, which is slow, deliberate, and logical. Most everyday decisions, Kahneman argued, are handled by System 1, which is efficient but prone to predictable errors. For example, the availability heuristic leads people to judge the likelihood of events based on how easily examples come to mind. Because airplane crashes receive extensive media coverage, many people overestimate the risk of flying relative to driving, even though statistically driving is far more dangerous per mile traveled.

Anchoring is another well-documented bias: people tend to rely heavily on the first piece of information they encounter when making judgments. In one classic experiment, participants were asked to estimate the percentage of African countries in the United Nations after first watching a roulette wheel spin to a random number. Those who saw a high number gave significantly higher estimates than those who saw a low number, despite the irrelevance of the roulette outcome.

These insights have given rise to the field of behavioral economics and practical applications in public policy. Governments and organizations now design "nudges"—subtle changes to how choices are presented—to steer people toward better decisions without restricting their freedom. For instance, enrolling employees automatically in retirement savings plans (while allowing opt-out) dramatically increases participation rates compared to systems that require active enrollment.
  `.trim(),
};

// ─── Questions ───────────────────────────────

export const ALL_QUESTIONS: Question[] = [
  // Passage 1
  {
    id: "q1",
    number: 1,
    passage: "p1",
    text: "According to the passage, where did the transition from hunting and gathering to farming first begin in the Near East?",
    answers: [
      { id: "a", text: "Along the banks of the Nile River" },
      { id: "b", text: "In a region known as the Fertile Crescent" },
      { id: "c", text: "At the site of Göbekli Tepe in Turkey" },
      { id: "d", text: "In the Indus Valley" },
    ],
    correctAnswerId: "b",
    explanation: "The passage explicitly states that wild grain became abundant 'across the Near East in a region often called the Fertile Crescent.'",
  },
  {
    id: "q2",
    number: 2,
    passage: "p1",
    text: "The climate change hypothesis suggests that agriculture emerged primarily because:",
    answers: [
      { id: "a", text: "Populations outgrew the capacity of local environments to support them" },
      { id: "b", text: "Large ceremonial gatherings required organized food production" },
      { id: "c", text: "Warmer post-Ice Age conditions made plant cultivation more viable" },
      { id: "d", text: "New technologies such as the wheel required settled communities" },
    ],
    correctAnswerId: "c",
    explanation: "The climate change hypothesis states that rising temperatures at the end of the Ice Age made plant cultivation more viable.",
  },
  {
    id: "q3",
    number: 3,
    passage: "p1",
    text: "The word 'pivotal' in paragraph 1 is closest in meaning to:",
    answers: [
      { id: "a", text: "Controversial" },
      { id: "b", text: "Gradual" },
      { id: "c", text: "Crucially important" },
      { id: "d", text: "Widely studied" },
    ],
    correctAnswerId: "c",
    explanation: "'Pivotal' means critically important or forming a turning point.",
  },
  {
    id: "q4",
    number: 4,
    passage: "p1",
    text: "According to the passage, what does Göbekli Tepe suggest about the origins of agriculture?",
    answers: [
      { id: "a", text: "Social complexity and ritual may have preceded and driven agricultural development" },
      { id: "b", text: "Agriculture was first practiced to support military campaigns" },
      { id: "c", text: "Population pressure was the sole driver of early farming" },
      { id: "d", text: "The earliest farmers were motivated by climate instability" },
    ],
    correctAnswerId: "a",
    explanation: "Göbekli Tepe predates agriculture and is used to argue that organized religion and social complexity may have driven the transition.",
  },
  {
    id: "q5",
    number: 5,
    passage: "p1",
    text: "Which of the following is NOT listed in the passage as a consequence of the agricultural revolution?",
    answers: [
      { id: "a", text: "Development of pottery and irrigation systems" },
      { id: "b", text: "Emergence of social hierarchies" },
      { id: "c", text: "Rise of civilizations along river valleys" },
      { id: "d", text: "Invention of writing systems" },
    ],
    correctAnswerId: "d",
    explanation: "Writing systems are not mentioned in the passage. Pottery, irrigation, social hierarchies, and river-valley civilizations are all listed.",
  },

  // Passage 2
  {
    id: "q6",
    number: 6,
    passage: "p2",
    text: "According to the passage, what percentage of the ocean floor has been mapped in high resolution?",
    answers: [
      { id: "a", text: "Less than 20 percent" },
      { id: "b", text: "More than 65 percent" },
      { id: "c", text: "Approximately 50 percent" },
      { id: "d", text: "About 35 percent" },
    ],
    correctAnswerId: "a",
    explanation: "The passage states: 'Scientists estimate that less than 20 percent of the ocean floor has been mapped in high resolution.'",
  },
  {
    id: "q7",
    number: 7,
    passage: "p2",
    text: "The term 'aphotic zone' as used in the passage refers to:",
    answers: [
      { id: "a", text: "The region just below the ocean's surface where light is reduced" },
      { id: "b", text: "The area of total darkness below 1,000 meters" },
      { id: "c", text: "The zone where hydrothermal vents are typically found" },
      { id: "d", text: "The twilight zone between 200 and 1,000 meters" },
    ],
    correctAnswerId: "b",
    explanation: "The passage says 'below 1,000 meters total darkness prevails. In this aphotic zone…' indicating it is the totally dark zone.",
  },
  {
    id: "q8",
    number: 8,
    passage: "p2",
    text: "Why is the 1977 discovery of hydrothermal vents considered significant?",
    answers: [
      { id: "a", text: "It confirmed that the deep sea contains valuable mineral deposits" },
      { id: "b", text: "It demonstrated that life can exist without sunlight, broadening concepts of habitability" },
      { id: "c", text: "It led to the first successful human descent to the Mariana Trench" },
      { id: "d", text: "It proved that ROVs could operate at extreme depths" },
    ],
    correctAnswerId: "b",
    explanation: "Hydrothermal vents host ecosystems based on chemical energy, 'reshaping our understanding of life's requirements' and suggesting life could exist elsewhere.",
  },
  {
    id: "q9",
    number: 9,
    passage: "p2",
    text: "Which of the following best describes 'marine snow' as referenced in the passage?",
    answers: [
      { id: "a", text: "Ice crystals that form at extreme ocean depths" },
      { id: "b", text: "Particles of nutrients that drift downward from surface waters" },
      { id: "c", text: "Bioluminescent signals used by deep-sea organisms" },
      { id: "d", text: "Sediment stirred up by hydrothermal vents" },
    ],
    correctAnswerId: "b",
    explanation: "The passage refers to 'scarce nutrients that drift down from surface waters in what researchers call marine snow.'",
  },
  {
    id: "q10",
    number: 10,
    passage: "p2",
    text: "According to the passage, what role is artificial intelligence playing in deep-sea exploration?",
    answers: [
      { id: "a", text: "Replacing human divers at extreme depths" },
      { id: "b", text: "Helping ROVs and AUVs make real-time decisions autonomously" },
      { id: "c", text: "Analyzing mineral samples collected from the ocean floor" },
      { id: "d", text: "Designing pressure-resistant materials for underwater vehicles" },
    ],
    correctAnswerId: "b",
    explanation: "The passage states that AI enables vehicles 'to make real-time decisions without human guidance.'",
  },

  // Passage 3
  {
    id: "q11",
    number: 11,
    passage: "p3",
    text: "According to the passage, the rational actor model assumed that humans would:",
    answers: [
      { id: "a", text: "Base decisions mainly on emotional responses" },
      { id: "b", text: "Systematically evaluate options to maximize personal utility" },
      { id: "c", text: "Rely on cognitive heuristics to make fast decisions" },
      { id: "d", text: "Be influenced by social pressure when making choices" },
    ],
    correctAnswerId: "b",
    explanation: "The rational actor model assumed people 'would evaluate options systematically and choose whatever maximized their personal utility.'",
  },
  {
    id: "q12",
    number: 12,
    passage: "p3",
    text: "The availability heuristic, as described in the passage, leads people to:",
    answers: [
      { id: "a", text: "Anchor their estimates to the first number they encounter" },
      { id: "b", text: "Judge the probability of events based on how easily examples come to mind" },
      { id: "c", text: "Prefer default options over active choices" },
      { id: "d", text: "Overestimate risks associated with slow, deliberate thinking" },
    ],
    correctAnswerId: "b",
    explanation: "The passage defines the availability heuristic as judging likelihood 'based on how easily examples come to mind.'",
  },
  {
    id: "q13",
    number: 13,
    passage: "p3",
    text: "In the anchoring experiment described in the passage, what did researchers find?",
    answers: [
      { id: "a", text: "Participants who saw a high roulette number gave lower country estimates" },
      { id: "b", text: "The roulette number had no measurable effect on the estimates" },
      { id: "c", text: "Participants who saw a high roulette number gave higher country estimates" },
      { id: "d", text: "Participants refused to answer after seeing an irrelevant number" },
    ],
    correctAnswerId: "c",
    explanation: "'Those who saw a high number gave significantly higher estimates than those who saw a low number.'",
  },
  {
    id: "q14",
    number: 14,
    passage: "p3",
    text: "The automatic enrollment example in the passage is used to illustrate which concept?",
    answers: [
      { id: "a", text: "The availability heuristic" },
      { id: "b", text: "The rational actor model" },
      { id: "c", text: "The anchoring bias" },
      { id: "d", text: "Nudges in behavioral economics" },
    ],
    correctAnswerId: "d",
    explanation: "Automatic enrollment is presented as an example of a 'nudge'—a behavioral economics tool to guide better decisions.",
  },
];

// ─── Exams ───────────────────────────────────

export const EXAMS: Exam[] = [
  {
    id: "exam-001",
    title: "TOEFL iBT Practice Test #1",
    description: "A full reading section simulation covering academic passages on history, science, and social science topics.",
    section: "reading",
    durationMinutes: 54,
    scheduledDate: "Oct 2, 2026",
    status: "completed",
    maxScore: 30,
    passages: [PASSAGE_1, PASSAGE_2],
    questions: ALL_QUESTIONS.filter((q) =>
      ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"].includes(q.id)
    ),
  },
  {
    id: "exam-002",
    title: "TOEFL iBT Practice Test #2",
    description: "A reading section exam emphasizing psychology and decision-making passage types.",
    section: "reading",
    durationMinutes: 36,
    scheduledDate: "Oct 6, 2026",
    status: "completed",
    maxScore: 30,
    passages: [PASSAGE_2, PASSAGE_3],
    questions: ALL_QUESTIONS.filter((q) =>
      ["q6", "q7", "q8", "q9", "q10", "q11", "q12", "q13", "q14"].includes(q.id)
    ),
  },
  {
    id: "exam-003",
    title: "TOEFL iBT Full Simulation",
    description: "A comprehensive reading simulation covering three academic passages. Timed and exam-room conditions apply.",
    section: "reading",
    durationMinutes: 90,
    scheduledDate: "Oct 18, 2026",
    status: "upcoming",
    maxScore: 30,
    passages: [PASSAGE_1, PASSAGE_2, PASSAGE_3],
    questions: ALL_QUESTIONS,
  },
];

export function getExamById(id: string): Exam | undefined {
  return EXAMS.find((e) => e.id === id);
}

export function getPassageById(exam: Exam, passageId: string): Passage | undefined {
  return exam.passages.find((p) => p.id === passageId);
}
``