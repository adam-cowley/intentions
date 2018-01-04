const TYPE_ENTITY = 'Entity';
const TYPE_NODE = 'Node';
const TYPE_NUMBER = 'Number';
const TYPE_CURRENCY = 'Currency';
const TYPE_PROPERTY = 'Property';
const TYPE_CONDITION = 'Condition';
const TYPE_LABEL = 'Label';
const TYPE_ANYTHING = 'Anything';

const REGEX_NUMBER = '([0-9,.]+)';
const REGEX_CURRENCY = '(\S{1})?([0-9,.]+)(\S{1})?';
const REGEX_ANYTHING_LAZY = '(\\S+)';
const REGEX_ANYTHING = "(.*)" //'"([A-Z0-9a-z]+)"'
const REGEX_CONDITION = '(less than|greater than)';

const CONDITION_LESS_THAN = 'less than';
const SYMBOL_LESS_THAN = '<';

const CONDITION_GREATER_THAN = 'greater than';
const SYMBOL_GREATER_THAN = '>';

class Slot {

    constructor(name, full, type, start, end, label) {
        this.name = name;
        this.full = full;
        this.type = type;
        this.start = start;
        this.end = end;
        this.label = label;
    }

    regex() {
        const type = this.type ? this.type.substr(1) : TYPE_ANYTHING;
        switch ( type ) {
            case TYPE_NUMBER:
                return REGEX_NUMBER;

            case TYPE_CURRENCY:
                return REGEX_CURRENCY;

            case TYPE_CONDITION:
                return REGEX_CONDITION;

            case TYPE_LABEL:
            case TYPE_NODE:
            case TYPE_PROPERTY:
            case TYPE_ANYTHING:
                return REGEX_ANYTHING;
        }

        throw new Error(`Type ${type} not found`);
    }

}

Slot.TYPE_ENTITY = TYPE_ENTITY;
Slot.TYPE_NUMBER = TYPE_NUMBER;
Slot.TYPE_CURRENCY = TYPE_CURRENCY;

Slot.CONDITION_LESS_THAN = CONDITION_LESS_THAN;
Slot.CONDITION_GREATER_THAN = CONDITION_GREATER_THAN;

module.exports = Slot;