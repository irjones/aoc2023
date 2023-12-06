module.exports = {
    run: function() {
        const input = require("./getInput").read("../input/day6");
        console.log({
            pt1: pt1(input),
            pt2: pt2(input),
        });
    }
}

function pt1(input) {
    const [time, distance] = input.split("\n")
        .map((line) => line.split(/:\s+/)[1])
        .map((nArr) => nArr.split(/\s+/)
            .map((n) => parseInt(n))
        );
    const raceRecords = [];
    for (let i = 0; i < time.length; i += 1) {
        raceRecords.push({ time: time[i], distance: distance[i] });
    }
    const waysToWinByRecord = [];
    for (const {time, distance} of raceRecords) {
        let wins = 0;
        for (let i = 0; i < time; i += 1) {
            const remainingTime = time - i;
            const distanceTravelled = remainingTime * i;
            if (distanceTravelled > distance) {
                wins += 1;
            }
        }
        waysToWinByRecord.push(wins);
    }

    return waysToWinByRecord.reduce((acc, next) => acc * next);
}

function pt2(input) {
    const [time, distance] = input.split("\n")
        .map((line) => line.split(/:\s+/)[1])
        .map((nArr) => nArr.split(/\s+/).reduce((acc, next) => acc + next)).map((n) => parseInt(n));
    let wins = 0;
    for (let i = 0; i < time; i += 1) {
        const remainingTime = time - i;
        const distanceTravelled = remainingTime * i;
        if (distanceTravelled > distance) {
            wins += 1;
        }
    }
    return wins;
}
