require('dotenv').config();
const DataRetriever = require('./services/DataRetriever');
const {INTEGER} = require("sequelize");

async function testTime(id, steps) {
    const dataRetriever = new DataRetriever(process.env.CLIENT_ID, process.env.ACCESS_TOKEN)
    let times = []
    let failures = 0
    let successes = 0
    let longest = Number.NEGATIVE_INFINITY
    let shortest = Number.POSITIVE_INFINITY
    for (let step = 0; step < steps; step++) {
        let timeDifference
        try {
            const startTime = performance.now();

            const data = await dataRetriever.getGameInfo('119171')


            const endTime = performance.now();
            timeDifference = endTime - startTime;
            longest = timeDifference < longest ? longest : timeDifference
            shortest = timeDifference > shortest ? shortest : timeDifference
            times.push(timeDifference)
            ++successes
        } catch {
            ++failures
        }
        console.log(`Step ${step} done in ${(timeDifference / 1000).toFixed(2)} secs`)
    }
    return [times, longest, shortest, successes, failures]
}

async function main() {
    const [
        times,
        longest,
        shortest,
        successes,
        failures
    ] = await testTime('1942', 50)
    console.log(`Number of success : ${successes}`)
    console.log(`Number of failures : ${failures}`)
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    console.log(`Average process time : ${(averageTime / 1000).toFixed(2)} secs`);
    console.log(`Longest process time : ${(longest / 1000).toFixed(2)} secs`);
    console.log(`Shortest process time : ${(shortest / 1000).toFixed(2)} secs`);
}

main()