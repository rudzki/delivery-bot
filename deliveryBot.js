/*
Delivery Bot
Random routes
*/

let edges = [
    ["Chris", "Julie"],
    ["Chris", "Phil"],
    ["Julie", "Sam"],
    ["Julie", "Jake"],
    ["Jake", "John"],
    ["Phil", "Sam"],
    ["Phil", "Jane"],
    ["Sam", "Alex"],
    ["Sam", "John"],
    ["John", "Lisa"],
    ["Jane", "Alex"],
    ["Alex", "Lisa"]
];

let botLocation = "Chris";

let undeliveredPackages = [
    { location: "Chris", destination: "Alex" },
    { location: "Sam", destination: "Lisa" },
    { location: "Julie", destination: "Jake" },
    { location: "Alex", destination: "John" }
];

function makeGraph() {
    let graph = new Map();
    edges.forEach( edge => { edge.forEach( node => {
                    if (!(node in graph)) {
                        graph[node] = edge.filter( p => p !== node );
                    } else {
                        graph[node].push(
                            edge.filter(p => p !== node && !(p in graph[node])).toString()
                        );
                    }
                });}
    );
    return graph;
}

class DeliveryBot {
    // outputs: new undeliveredPackages, new botLocation
    constructor(map, undeliveredPackages, botLocation) {
        this.map = map;
        this.undeliveredPackages = undeliveredPackages;
        this.botLocation = botLocation;
    }

    next() {
        // is there a package to pick up here?
        let newUndeliveredPackages = this.undeliveredPackages.map(
            p => {
                if (p.location === this.botLocation)
                    p.location = "En route";
                return p;
            }
        )
        // is there a package to deliver here?
        .filter(
            p => {
                return (p.destination !== this.botLocation) || (p.location !== "En route")
            }
        );

        let randomIndex = Math.floor(Math.random() * this.map[this.botLocation].length);
        let newRobotLocation = this.map[this.botLocation][randomIndex];
        return new DeliveryBot(this.map, newUndeliveredPackages, newRobotLocation);

    }
}

let deliverAll = function(print=true) {
    let map = makeGraph(edges);
    let currentState = new DeliveryBot(map, undeliveredPackages, botLocation);
    let iterations = 1;

    while (currentState.undeliveredPackages.length > 0) {
        if (print) {
            console.log(`${iterations} \n`);
            console.log(currentState);
            console.log();
        }
        currentState = currentState.next();
        iterations++;
    }

    return iterations;
};


let runTrials = function (numTrials=50) {
    let trials = [];
    let numTrialsRemaining = numTrials;
    while (numTrialsRemaining > 0) {
        let trialNumMoves = deliverAll(false);
        trials.push(trialNumMoves);
        numTrialsRemaining--;
    }

    let avg = trials.reduce((a, b) => a+b) / trials.length;
    let min = trials.reduce((a, b) => (a < b) ? a : b );
    let max = trials.reduce((a, b) => (a > b) ? a : b );

    console.log(
            `
            ===================
            Trials
            ===================
            Trials: ${trials}
            Number of trials: ${numTrials}

            ===================
            Moves to finish
            ===================
            Avg: ${avg}
            Range: ${min} to ${max}
            `
    );
};
deliverAll();
runTrials(50);
