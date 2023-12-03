module.exports = {
  run: function () {
    const input = require("./getInput").read("../input/day3");
    console.log("Day 3");
    console.log({
      pt1: pt1(input).reduce((acc, next) => acc + next),
      pt2: pt2(input),
    });
  },
};

function pt1(input) {
  const numbers = getGridCoordinatesForPattern(/\d+/g, input);
  const symbols = getGridCoordinatesForPattern(/[^.\d\n]/g, input).reduce(
    (acc, next) => {
      acc.add(next.start);
      return acc;
    },
    new Set(),
  );
  const numbersWithSymbolNeighbors = [];
  for (const num of numbers) {
    for (const neighbor of num.neighborCoordinates) {
      if (symbols.has(neighbor)) {
        numbersWithSymbolNeighbors.push(parseInt(num.value));
        break;
      }
    }
  }
  return numbersWithSymbolNeighbors;
}

function pt2(input) {
  // map of pos -> value
  const numbers = getGridCoordinatesForPattern(/\d+/g, input).reduce(
    (acc, next) => {
      // collapse the values in the map, a range points to the same value
      // e.g. coord 0 => 467, 1 => 467, 2 => 467
      for (let i = next.start; i <= next.end; i += 1) {
        acc.set(i, next.value);
      }
      return acc;
    },
    new Map(),
  );
  // find all gears with neighbors
  const possibleGears = getGridCoordinatesForPattern(/\*/g, input);
  // find all possible gears touching two numbers
  const matches = [];
  for (const candidate of possibleGears) {
    const nums = new Set();
    for (const neighbor of candidate.neighborCoordinates) {
      const value = numbers.get(neighbor);
      if (value) nums.add(parseInt(value));
    }
    if (nums.size === 2) {
      matches.push(Array.from(nums).reduce((acc, next) => acc * next));
    }
  }

  return matches.reduce((acc, next) => acc + next);
}

function getGridCoordinatesForPattern(pattern, input) {
  const lines = input.split("\n");
  const lineSize = lines[0].length + 1; // plus one for newlines
  const lineCount = lines.length;
  return [...input.matchAll(pattern)].map((e) => {
    const coord = {
      start: e.index,
      end: e.index + e[0].length - 1,
      value: e[0],
      relativeStart: e.index % lineSize, // the x
      relativeEnd: (e.index % lineSize) + (e[0].length - 1),
    };
    return {
      ...coord,
      neighborCoordinates: generateNeighborCoordinates(coord, lineSize),
    };
  });
}

function generateNeighborCoordinates(coordinate, lineSize) {
  const outOfBounds = -1;
  // create a range for row above
  const topLeft =
    coordinate.relativeStart === 0
      ? coordinate.start - lineSize
      : coordinate.start - (lineSize + 1);
  const topRight =
    coordinate.relativeEnd === lineSize
      ? coordinate.end - lineSize
      : coordinate.end - (lineSize - 1);
  // same row neighbors
  const left =
    coordinate.relativeStart === 0 ? outOfBounds : coordinate.start - 1;
  const right =
    coordinate.relativeEnd === lineSize ? outOfBounds : coordinate.end + 1;
  // below
  const bottomLeft =
    coordinate.relativeStart === 0
      ? coordinate.start + lineSize
      : coordinate.start + (lineSize - 1);
  const bottomRight =
    coordinate.relativeEnd === lineSize
      ? coordinate.end + lineSize
      : coordinate.end + (lineSize + 1);
  const absoluteNeighborIndexes = new Set([left, right]);
  for (let i = topLeft; i <= topRight; i += 1) {
    absoluteNeighborIndexes.add(i);
  }
  for (let i = bottomLeft; i <= bottomRight; i += 1) {
    absoluteNeighborIndexes.add(i);
  }
  return absoluteNeighborIndexes;
}
