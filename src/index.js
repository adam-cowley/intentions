const SlotResult = require('./Result/SlotResult');
const IntentResult = require('./Result/IntentResult');
const createIntent = require('./Intent/createIntent');
const Intent = require('./Intent/Intent');

class Intentions {

    /**
     * The road to hell is paved with good intentions.
     *
     * @param  {Driver} driver Neo4j Driver
     * @return {void}
     */
    constructor(driver) {
        this.setDriver(driver);

        this.intents = new Map();
        this.handlers = new Map();
    }

    /**
     * Set the Neo4j Driver
     * @param {Driver} driver Set the Neo4j Driver instance
     * @return {Intentions}
     */
    setDriver(driver) {
        this.driver = driver;

        return this;
    }

    /**
     * Register a new Intent
     *
     * @param  {String}     name     The Unique Identifier for the intent
     * @param  {String...}  phrases  An array of phrases to trigger this intent
     * @param  {Int}        priority The priiority of this event (the lower the better)
     * @return {Intentions}
     */
    registerIntent(name, phrases, priority = 10) {
        const intent = createIntent(name, phrases, priority);
        this.intents.set(name, intent);

        return this;
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
        if ( intent instanceof Intent ) {
            intent = intent.name;
        }

        if ( ! this.handlers.has(intent) ) {
            throw new Error(`No handler registered for ${intent}`);
        }

        const constructor = this.handlers.get(intent);
        const handler = new constructor(this.driver, parts);

        return handler.run();
    }

    /**
     * Parse a query string and return a set of valid intents
     * ordered by their priority.
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
                        // Shift Index to ignore the full match
                        index += 1;

                        return [slot.name, new SlotResult(slot, values[ index ]) ];
                    }) );

                    matches.push( new IntentResult(intent, parts) );
                }
            });
        });

        return Promise.resolve( matches.sort((a, b) => {
            return b.intent.priority - a.intent.priority
        }) );
    }


}



module.exports = Intentions;