module.exports = {
    run: function() {
        const input = require("./getInput").read("../input/day5");
        console.log({
            pt1: timed(() => pt1(input)),
            pt2: timed(() => pt2(input))
        });
    }
}

function isInRangeInclusive(n, lower, upper) {
    return n >= lower && n < upper;
}

function inputToMaps(input) {
    const rawMaps = input.split("\n\n");
    const seeds = rawMaps[0].split(": ")[1].split(" ").map((s) => parseInt(s));
    const maps = rawMaps.slice(1).map(parseMap);
    return { seeds, maps };
}

function parseMap(mapSection) {
    return mapSection.split("\n")
        .slice(1)
        .map(
            (s) => s.split(" ")
                .map((n) => parseInt(n))
                .reduce((acc, next, i) => {
                    const propToSet = [
                        "destinationRangeStart",
                        "sourceRangeStart",
                        "rangeLength"
                    ][i];
                    acc[propToSet] = next;
                    return acc;
                }, {})
        );
}

function pt1(input) {
    const almanac = inputToMaps(input);
    const paths = [];
    for (const seed of almanac.seeds) {
        const path = [seed];
        for (const map of almanac.maps) {
            let maybeMapping;
            for (const entry of map) {
                const { sourceRangeStart, destinationRangeStart, rangeLength } = entry;
                const latest = path[path.length - 1];
                const isInSourceRange = isInRangeInclusive(latest, sourceRangeStart, sourceRangeStart + rangeLength);
                if (isInSourceRange) {
                    maybeMapping = latest + destinationRangeStart - sourceRangeStart;
                }
            }
            path.push(maybeMapping ?? path[path.length - 1]);
        }
        paths.push(path);
    }
    return Math.min(...paths.map((p) => p[p.length - 1]));
}

function timed(fn) {
    try {
        console.time(fn.name);
        return fn();
    } finally {
        console.timeEnd(fn.name);
    }
}

function pt2(input) {
    const rawMaps = input.split("\n\n");
    // should probably untangle this but I'm tired.
    const almanac = inputToMaps(input);
    return rawMaps[0].split(" ")
        .map((s) => parseInt(s))
        .slice(1)
        .reduce((acc, next, i) => {
            const last = acc[acc.length - 1];
            if (last.length === 2) {
                acc.push([next]);
            } else {
                last.push(next);
            }
            return acc;
        }, [[]])
        .map(([start, length]) => {
            let lowestNumber = Infinity;
            for (let i = start; i < start + length; i += 1) {
                const result = mapToFinal(i, almanac);
                if (result < lowestNumber) {
                    lowestNumber = result;
                }
            }
            return lowestNumber;
        })
        .reduce((acc, next) => acc.concat(next), []).sort()[0];
}

function mapToFinal(seed, almanac) {
    const path = [seed];
    for (const map of almanac.maps) {
        let maybeMapping;
        for (const entry of map) {
            const { sourceRangeStart, destinationRangeStart, rangeLength } = entry;
            const latest = path[path.length - 1];
            const isInSourceRange = isInRangeInclusive(latest, sourceRangeStart, sourceRangeStart + rangeLength);
            if (isInSourceRange) {
                maybeMapping = latest + destinationRangeStart - sourceRangeStart;
            }
        }
        path.push(maybeMapping ?? path[path.length - 1]);
    }
    return path[path.length - 1];
}