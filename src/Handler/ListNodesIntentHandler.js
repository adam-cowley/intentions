const IntentHandler = require('./IntentHandler');
const nlp = require('compromise');

class ListNodesIntentHandler extends IntentHandler {

    run() {
        const label = this._toSingular( this.parts.get('label').value );
        const params = {};
        let cypher = `MATCH (node:${label})`;

        if ( this.parts.has('property') && this.parts.has('value') ) {
            const property = this.parts.get('property').value;
            const condition = this._getCondition();
            const value = this.parts.get('value').value;
            const key = `where_${property}`;

            params[ key ] = value;

            cypher += `\nWHERE node.\`${property}\` ${condition} {${key}}`;
        }

        cypher += `\n RETURN node`;

        if ( this.parts.has('order') ) {
            const order = this.parts.get('order');
            const sort =  this.parts.get('sort') || 'ASC';

            cypher += `\nORDER BY node.``${order}`` ${sort}`
        }

        const limit = this.parts.get('limit') || 100;
        const skip = this.parts.get('skip') || 0;

        cypher += `\n SKIP ${skip} LIMIT ${limit}`;

        const session = this.neo4j.session();

        return session.run(cypher, params)
            .then(res => {
                return res.records.map(row => {
                    return row.get('node').properties
                });
            })
            .finally(() => {
                session.close();
            });
    }



}

module.exports = ListNodesIntentHandler;