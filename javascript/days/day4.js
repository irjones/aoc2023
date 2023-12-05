module.exports = {
  run: function () {
    const input = require("./getInput").read("../input/day4");
    console.log({
      pt1: pt1(input),
      pt2: pt2(input),
    });
  },
};

function pt1(input) {
  const cards = input.split("\n").map(parseToCard);
  return cards
    .map((card) => {
      let points = card.intersection.size > 0 ? 1 : 0;
      const matchGroups = card.intersection.size - (1 % 3);
      for (let i = 0; i < matchGroups; i += 1) {
        points *= 2;
      }
      return points;
    })
    .reduce((acc, next) => acc + next);
}

function pt2(input) {
  const cardToMatchesMap = input
    .split("\n")
    .map(parseToCard)
    .reduce((acc, next) => {
      // map card ID to number of matches
      acc.set(parseInt(next.cardId), next.intersection.size);
      return acc;
    }, new Map());

  const copiesById = Array.from(cardToMatchesMap.entries()).reduce(
    (acc, [cardId]) => {
      acc.set(cardId, 1);
      return acc;
    },
    new Map(),
  );

  for (const [cardId, matches] of cardToMatchesMap) {
    const copies = copiesById.get(cardId);
    for (let i = cardId + 1; i <= cardId + matches; i += 1) {
      copiesById.set(i, copiesById.get(i) + copies);
    }
  }
  return Array.from(copiesById).reduce((acc, [_, n]) => acc + n, 0);
}

function parseToCard(line) {
  const [cardTitle, numbers] = line.split(": ");
  const [_, cardId] = cardTitle.split(/\s+/);
  const [winningHalf, ourHalf] = numbers.split(" | ");
  const winningNumbers = new Set(winningHalf.split(" ").filter((n) => !!n));
  const ourNumbers = new Set(ourHalf.split(" ").filter((n) => !!n));
  const intersection = new Set();
  for (const number of winningNumbers) {
    if (ourNumbers.has(number)) {
      intersection.add(number);
    }
  }
  // this contains more info than we need, but I didn't know what pt2 would need yet
  return {
    cardId,
    winningNumbers,
    ourNumbers,
    intersection,
  };
}
