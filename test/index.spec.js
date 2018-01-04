const {assert, expect} = require('chai');
const Intentions = require('../src');

describe('index.js', () => {
    const driver = require('./driver');
    const instance = require('./instance');

    const name = 'SomeIntent';
    const phrases = ['Give me an {letter}'];
    const priority = 10;
    const trigger = 'Give me an s';

    class SomeHandler {
        constructor(driver, parts) {
            this.driver = driver;
            this.parts = parts;
        }

        run() {
            this.driver.run();

            return true;
        }
    }

    describe('::constructor', () => {
        it('should construct', () => {
            expect(instance).to.be.an.instanceOf(Intentions);
            expect(driver).to.equal(driver);
        });
    });

    describe('::setDriver', () => {
        it('should set the driver', () => {
            instance.setDriver(null);
            expect(instance.driver).to.equal(null);

            instance.setDriver(driver);
            expect(instance.driver).to.equal(driver);
        });
    });

    describe('::registerIntent', () => {
        it('should register an intent', () => {
            instance.registerIntent(name, phrases, priority);

            const created = instance.intents.get(name);

            expect(created.name).to.equal(name);
            expect(created.priority).to.equal(priority);
            expect(created.utterances.length).to.equal(phrases.length);

            expect(created.utterances[0].phrase).to.equal(phrases[0]);
            expect(created.utterances[0].slots.length).to.equal(1);
        });
    });

    describe('::registerHandler', () => {
        instance.registerHandler(name, SomeHandler);

        const handler = instance.handlers.get(name);
        expect(handler).to.equal(SomeHandler);
    });

    describe('::parse', () => {
        instance.registerIntent('SomeOtherIntent', ['Ignore Me']);
        instance.registerIntent('LowPriorityIntent', ['Give me an {letter}'], 1);

        it('should do something', () => {
            const intents = instance.parse(trigger);

            expect(intents.length).to.equal(2);

            expect(intents[0].intent.name).to.equal(name);
            expect(intents[1].intent.name).to.equal('LowPriorityIntent');

        });
    });

    describe('::run', () => {
        const parts = new Map([ ['letter', 'S'] ]);

        it('should handle an intent', () => {
            const output = instance.handle(name, parts);
            expect(output).to.equal(true);
        });

        it('should have triggered the run method on the driver', () => {
            expect(driver.hasRun).to.equal(true);
        });
    });

});
