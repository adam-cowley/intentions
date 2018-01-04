const SlotResult = require('../Result/SlotResult');
const IntentResult = require('../Result/IntentResult');

class QueryParser {

    constructor(neode) {
        this.neode = neode;

        this.intents = new Array();
        this.handlers = new Map();
    }

    /**
     * Register a new Intent Handler
     *
     * @param  {String}       key Name of Intent
     * @param  {IntentHandler}  fn  IntentHandler instance
     * @return {QueryParser}
     */
    registerHandler(key, fn) {
        this.handlers.set(key, fn);

        return this;
    }

    /**
     * Find an event handler and run it
     *
     * @param  {String}       intent
     * @param  {Map}          parts
     * @return {Promise}
     */
    handle(intent, parts) {
        if ( ! this.handlers.has(intent) ) {
            throw new Error(`No handler registered for ${intent}`);
        }

        const constructor = this.handlers.get(intent);
        const handler = new constructor(this.neode, parts);

        return handler.run();
    }

    /**
     * Register a new Intent
     * @param  {Intent} intent
     * @return {QueryParser}
     */
    registerIntent(intent) {
        this.intents.push(intent);

        return this;
    }

    /**
     * Parse a query string and return a set of intents
     *
     * @param  {String} query
     * @return {Array}
     */
    parse(query) {
        const matches = [];

        this.intents.forEach(intent => {
            intent.utterances.forEach(utterance => {
                const regex = utterance.regex();

                if ( regex.test(query) ) {
                    const values = query.match( regex );
                    const parts = new Map( utterance.slots.map((slot, index) => {
                        // Shift Index
                        index += 1;

                        return [slot.name, new SlotResult(slot, values[ index ]) ];
                    }) );

                    matches.push( new IntentResult(intent, parts) );
                }
            });
        });

        return matches.sort((a, b) => { return a.priority - b.priority });
    }


}

module.exports = QueryParser;