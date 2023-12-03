module.exports = {
  run: function () {
    const inputLines = require('./getInput').read("../input/day1").split("\n");
    console.log("Day 1");
    console.log({
      pt1: inputLines.map(pt1).reduce((acc, next) => acc + next),
      pt2: inputLines.map(pt2).reduce((acc, next) => acc + next),
    });
  },
};

const wordMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function pt1(inputLine) {
  const matches = inputLine.match(/\d/g) ?? [];
  if (matches.length === 0) {
    return 0;
  }
  return parseInt(`${matches[0]}${matches[matches.length - 1]}`);
}

function pt2(inputLine) {
  const matches = Array.from(
    inputLine.matchAll(
      /(?=(one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9))\w|\d/g,
    ),
  )?.map((m) => m[1]);
  if (matches.length === 0) {
    return 0;
  }
  const first = wordMap[matches[0]] ?? matches[0];
  const last =
    wordMap[matches[matches.length - 1]] ?? matches[matches.length - 1];
  return parseInt(`${first}${last}`);
}
