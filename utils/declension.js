export const declension = (number, words) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

// Варианты склонения:
// Для спальни: ['Спальня', 'Спальни', 'Спален']
// Для ванной: ['Ванная', 'Ванные', 'Ванных']
