const {
    CONDITION_LESS_THAN,
    CONDITION_GREATER_THAN,
} = require('../Intent/Slot');

class IntentHandler {

    constructor(neo4j, parts) {
        this.neo4j = neo4j;
        this.parts = parts;
    }

    run() {
        throw new Error('IntentHandler must override the run() method');
    }

    _getCondition() {
        if ( !this.parts.has('condition') ) {
            return '=';
        }

        switch (this.parts.get('condition').value) {
            case CONDITION_LESS_THAN:
                return '<=';

            case CONDITION_GREATER_THAN:
                return '>=';

            default:
                return '=';
        }
    }

    _toSingular(label) {
        const singular = nlp(label).nouns().toSingular().first().out();

        return singular[0].toUpperCase() + singular.substr(1);
    }

}

module.exports = IntentHandler;