const {
    TYPE_NUMBER,
    TYPE_CURRENCY,
} = require('../Intent/Slot');

class SlotResult {
    constructor(slot, value) {
        this._slot = slot;
        this._value = value;
    }

    /**
     * Get the details for this slot
     *
     * @return {Slot}
     */
    get slot() {
        return this._slot;
    }

    /**
     * Transform the value for the slot
     * @return {mixed}
     */
    get value() {
        const output = this._value;

        switch ( this.slot.type ) {
            case TYPE_NUMBER:
                return parseInt(output);

            case TYPE_CURRENCY:
                return parseInt(output.replace(/[^0-9]/g, ''));
        }

        return output;
    }
}

module.exports = SlotResult;