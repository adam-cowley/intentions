class Intent {
    constructor(name, utterances = [], priority = 1.0) {
        this.name = name;
        this.utterances = utterances;
        this.priority = priority;
    }

    toString() {
        return this.name;
    }
}

module.exports = Intent;