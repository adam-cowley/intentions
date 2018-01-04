
const REGEXP_REPLACE = [ '?' ];

class Utterance {

    constructor(phrase, slots = []) {
        this.phrase = phrase;
        this.slots = slots;
    }

    addSlot(slot) {
        this.slots.push(slot);
    }

    /*
    matchOn() {
        let phrase = this.phrase;

        this.slots.forEach(slot => {
            const replace = slot.type || '.';
            phrase = phrase.replace(slot.full, replace);
        });

        return phrase;
    }
    */

    regex() {
        let phrase = this.phrase;

        REGEXP_REPLACE.forEach(replace => {
            phrase = phrase.replace(replace, `\\${replace}`);
        });

        this.slots.forEach(slot => {
            phrase = phrase.replace(slot.full, slot.regex());
        });

        return new RegExp(`^${phrase}$`, 'i');
    }

}


module.exports = Utterance;