// Formato dos dados mockados:
// Topic    = { id, title, description, exercises: Exercise[] }
// Exercise = { id, level (1 a 3), situation, hint, accepted[], mistakes: [{ pattern, explanation }], suggestion, tip }
// Attempt  = { id, topicId, exerciseId, situation, answer, correct, date }
//
// Dados mockados. Na Sprint 2 os exercícios passam a ser gerados pela IA (API FastAPI).
export const mockTopics = [
  {
    id: "simple-present",
    title: "Simple Present: minha rotina",
    description: "Falar do que fazemos todos os dias: acordar, estudar, gostar e não gostar.",
    exercises: [
      {
        id: "sp-1",
        level: 1,
        situation: "Diga que você acorda às 7 horas.",
        hint: "Use o verbo wake up.",
        accepted: [
          "I wake up at 7",
          "I wake up at seven",
          "I wake up at 7 o'clock",
          "I wake up at seven o'clock",
          "I get up at 7",
          "I get up at seven",
        ],
        mistakes: [
          {
            pattern: "^i wakes",
            explanation: "Com I, o verbo fica sem -s: I wake up. O -s só aparece com he, she e it.",
          },
          { pattern: "\\bam wake", explanation: "Não use am com verbo de ação. Basta dizer I wake up." },
        ],
        suggestion: "I wake up at 7 o'clock.",
        tip: "Para falar de rotina usamos o presente simples: sujeito + verbo, sem -s quando o sujeito é I.",
      },
      {
        id: "sp-2",
        level: 2,
        situation: "Diga que sua amiga Ana estuda inglês toda segunda-feira.",
        hint: "Com Ana (she), o verbo ganha terminação. Study é um caso especial.",
        accepted: [
          "Ana studies English every Monday",
          "Ana studies English on Mondays",
          "She studies English every Monday",
          "She studies English on Mondays",
        ],
        mistakes: [
          {
            pattern: "studys",
            explanation: "Verbos terminados em consoante + y trocam o y por -ies: study vira studies.",
          },
          {
            pattern: "\\b(ana|she) study\\b",
            explanation: "Com he, she, it (ou um nome, como Ana), o verbo ganha -s ou -es: she studies.",
          },
        ],
        suggestion: "Ana studies English every Monday.",
        tip: "Na terceira pessoa do singular (he, she, it), o verbo recebe -s ou -es.",
      },
      {
        id: "sp-3",
        level: 3,
        situation: "Diga que seu irmão não gosta de acordar cedo.",
        hint: "Para negar, use doesn't + verbo.",
        accepted: [
          "My brother doesn't like to wake up early",
          "My brother does not like to wake up early",
          "My brother doesn't like waking up early",
          "My brother does not like waking up early",
          "He doesn't like to wake up early",
          "He doesn't like waking up early",
        ],
        mistakes: [
          {
            pattern: "(doesn't|does not) likes",
            explanation: "Depois de doesn't, o verbo volta ao normal, sem -s: doesn't like.",
          },
          {
            pattern: "\\b(brother|he) don't",
            explanation: "Com he, she, it (my brother), a negação é doesn't, não don't.",
          },
        ],
        suggestion: "My brother doesn't like to wake up early.",
        tip: "A negação no presente simples usa don't (I, you, we, they) ou doesn't (he, she, it) + verbo sem -s.",
      },
    ],
  },
  {
    id: "pedindo-coisas",
    title: "Pedindo coisas com educação",
    description: "Pedir um lanche, perguntar preços e formas de pagamento no dia a dia.",
    exercises: [
      {
        id: "pc-1",
        level: 1,
        situation: "Peça um sanduíche na cantina, com educação.",
        hint: "Tente I'd like... ou Can I have...?",
        accepted: [
          "I'd like a sandwich, please",
          "I would like a sandwich please",
          "Can I have a sandwich please",
          "Can I have a sandwich",
          "Could I have a sandwich please",
        ],
        mistakes: [
          {
            pattern: "^i want",
            explanation: "I want soa direto demais. Para pedir com educação, prefira I'd like... ou Can I have...?",
          },
        ],
        suggestion: "I'd like a sandwich, please.",
        tip: "I'd like é a forma educada de dizer I want. Acrescentar please ajuda ainda mais.",
      },
      {
        id: "pc-2",
        level: 2,
        situation: "Pergunte quanto custa o suco.",
        hint: "Para preço, use How much...",
        accepted: [
          "How much is the juice",
          "How much does the juice cost",
          "How much is the orange juice",
          "How much is juice",
        ],
        mistakes: [
          {
            pattern: "how many",
            explanation: "How many é para coisas que se contam (quantos). Para preço, use How much.",
          },
          {
            pattern: "how much costs?\\b",
            explanation: "Com How much, use is (How much is the juice?) ou does ... cost (How much does it cost?).",
          },
        ],
        suggestion: "How much is the juice?",
        tip: "Para perguntar preço: How much is...? (um item) ou How much are...? (vários).",
      },
      {
        id: "pc-3",
        level: 3,
        situation: "Pergunte se você pode pagar com cartão.",
        hint: "Em inglês, pagamos by card ou with a card.",
        accepted: [
          "Can I pay by card",
          "Can I pay with a card",
          "Can I pay by credit card",
          "Can I pay with card",
          "Could I pay by card",
          "May I pay by card",
        ],
        mistakes: [
          { pattern: "can i to pay", explanation: "Depois de can não se usa to: Can I pay...?" },
          { pattern: "pay (in|on) (a )?card", explanation: "Em inglês, pagamos by card ou with a card, não in card." },
        ],
        suggestion: "Can I pay by card?",
        tip: "Depois de can, o verbo vem sem to. Para meio de pagamento, use by ou with.",
      },
    ],
  },
  {
    id: "there-is-are",
    title: "There is / There are",
    description: "Dizer o que existe em um lugar: a sala, a escola, a cidade.",
    exercises: [
      {
        id: "ta-1",
        level: 1,
        situation: "Diga que há uma mesa na sala.",
        hint: "There is + singular.",
        accepted: ["There is a table in the room", "There's a table in the room"],
        mistakes: [
          {
            pattern: "there have|^have a table",
            explanation: "Para dizer que algo existe em um lugar, use there is, não have.",
          },
        ],
        suggestion: "There is a table in the room.",
        tip: "There is serve para uma coisa só (singular). There are, para várias.",
      },
      {
        id: "ta-2",
        level: 2,
        situation: "Diga que há três cadeiras na sala.",
        hint: "Com mais de uma coisa, there are e o substantivo no plural.",
        accepted: ["There are three chairs in the room", "There are 3 chairs in the room"],
        mistakes: [
          { pattern: "there is (three|3)", explanation: "Com plural (três cadeiras), use there are." },
          {
            pattern: "(three|3) chair\\b",
            explanation: "Depois de um número maior que 1, o substantivo vai para o plural: chairs.",
          },
        ],
        suggestion: "There are three chairs in the room.",
        tip: "Plural pede there are e o substantivo com -s: three chairs.",
      },
      {
        id: "ta-3",
        level: 3,
        situation: "Pergunte se há uma biblioteca na escola.",
        hint: "Em perguntas, a ordem se inverte.",
        accepted: [
          "Is there a library in the school",
          "Is there a library at the school",
          "Is there a library in this school",
          "Is there a library at school",
        ],
        mistakes: [
          {
            pattern: "^there is a library",
            explanation: "Em perguntas, inverta a ordem: Is there...? (e não There is...?).",
          },
        ],
        suggestion: "Is there a library in the school?",
        tip: "Para perguntar, coloque is antes de there: Is there...? / Are there...?",
      },
    ],
  },
];
export const mockAttempts = [
  {
    id: "a1",
    topicId: "simple-present",
    exerciseId: "sp-1",
    situation: "Diga que você acorda às 7 horas.",
    answer: "I wake up at seven",
    correct: true,
    date: "02/11/2026",
  },
  {
    id: "a2",
    topicId: "simple-present",
    exerciseId: "sp-2",
    situation: "Diga que sua amiga Ana estuda inglês toda segunda-feira.",
    answer: "Ana study English every Monday",
    correct: false,
    date: "02/11/2026",
  },
  {
    id: "a3",
    topicId: "pedindo-coisas",
    exerciseId: "pc-1",
    situation: "Peça um sanduíche na cantina, com educação.",
    answer: "I want a sandwich",
    correct: false,
    date: "03/11/2026",
  },
];
// Erros mais comuns da turma (visão do professor), também mockados.
export const mockCommonErrors = [
  { label: "Esquecer o -s na 3ª pessoa (she study)", count: 9 },
  { label: "Usar don't com he/she/it", count: 6 },
  { label: "Usar I want em vez de I'd like", count: 5 },
  { label: "There is com plural", count: 4 },
];
