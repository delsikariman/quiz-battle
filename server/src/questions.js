export const QUESTIONS = [
  {
    id: 1,
    question: "Ibu kota Indonesia adalah?",
    options: ["Bandung", "Surabaya", "Jakarta", "Medan"],
    answer: 2,
  },
  {
    id: 2,
    question: "Planet terbesar di tata surya adalah?",
    options: ["Saturnus", "Jupiter", "Neptunus", "Uranus"],
    answer: 1,
  },
  {
    id: 3,
    question: "Siapa penemu bola lampu?",
    options: ["Nikola Tesla", "Albert Einstein", "Thomas Edison", "Isaac Newton"],
    answer: 2,
  },
  {
    id: 4,
    question: "Berapa hasil dari 17 × 8?",
    options: ["126", "136", "146", "156"],
    answer: 1,
  },
  {
    id: 5,
    question: "Bahasa pemrograman yang dikembangkan oleh Guido van Rossum adalah?",
    options: ["Java", "C++", "Python", "Ruby"],
    answer: 2,
  },
  {
    id: 6,
    question: "Negara dengan penduduk terbanyak di dunia adalah?",
    options: ["Amerika Serikat", "India", "Indonesia", "Cina"],
    answer: 3,
  },
  {
    id: 7,
    question: "Unsur kimia dengan simbol 'Au' adalah?",
    options: ["Perak", "Emas", "Aluminium", "Besi"],
    answer: 1,
  },
  {
    id: 8,
    question: "Siapa yang menulis novel 'Harry Potter'?",
    options: ["Stephen King", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
    answer: 2,
  },
  {
    id: 9,
    question: "Kecepatan cahaya sekitar berapa km/s?",
    options: ["200.000", "250.000", "300.000", "350.000"],
    answer: 2,
  },
  {
    id: 10,
    question: "Olahraga apa yang dimainkan di Wimbledon?",
    options: ["Golf", "Tenis", "Kriket", "Bulu Tangkis"],
    answer: 1,
  },
  {
    id: 11,
    question: "Berapa sisi yang dimiliki segi enam?",
    options: ["5", "6", "7", "8"],
    answer: 1,
  },
  {
    id: 12,
    question: "Gunung tertinggi di dunia adalah?",
    options: ["K2", "Kangchenjunga", "Everest", "Lhotse"],
    answer: 2,
  },
  {
    id: 13,
    question: "Bahasa resmi Brasil adalah?",
    options: ["Spanyol", "Inggris", "Portugis", "Prancis"],
    answer: 2,
  },
  {
    id: 14,
    question: "HTTP singkatan dari?",
    options: [
      "HyperText Transfer Protocol",
      "High Transfer Text Protocol",
      "Hyper Terminal Text Protocol",
      "Home Transfer Text Process",
    ],
    answer: 0,
  },
  {
    id: 15,
    question: "Siapa pelukis 'Mona Lisa'?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"],
    answer: 2,
  },
];

export function getRandomQuestions(count = 10) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
