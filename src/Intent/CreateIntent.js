const Slot = require('./Slot');
const Utterance = require('./Utterance');
const Intent = require('./Intent');

module.exports = function createIntent(name, phrases, priority = 10) {
    const match_variable = /([a-z0-9]+)/;
    const match_label = /(:[A-Z][a-z0-9]+)/;
    const match_type = /(#[A-Z][a-z0-9]+)/;

    const slot_pattern = /{([a-z0-9]+)(#[A-Z][a-z0-9]+)?(:[A-Z][a-z0-9]+)?}/g;

    const utterances = [];

    // Parse Phrases
    phrases.forEach(phrase => {
        const slots = [];

        if ( slot_pattern.test(phrase) ) {
            const matched_slots = phrase.match(slot_pattern);

            // Parse Slot
            matched_slots.forEach(matched => {
                slots.push( createSlot(phrase, matched) );
            });
        }

        utterances.push( new Utterance(phrase, slots) );
    });


    return new Intent(name, utterances, priority);
}

function createSlot(phrase, slot) {
    const slot_pattern = /{([a-z0-9]+)(#[A-Z][a-z0-9]+)?(:[A-Z][a-z0-9]+)?}/;

    const start = phrase.indexOf(slot);
    const end = start + slot.length;

    const [ full, name, type, label ] = slot.match(slot_pattern);

    return new Slot(name, full || name, type, start, end, label);
}