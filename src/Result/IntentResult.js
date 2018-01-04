class IntentResult {
    constructor(intent, parts) {
        this.intent = intent;
        this.parts = parts;
    }

    intentName() {
        return this.intent.name;
    }

    get(key) {
        return this.parts.get(key);
    }
}

module.exports = IntentResult;