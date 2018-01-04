class ListPeopleByNameHandler {

    /**
     * The constructor takes the Neo4j driver and
     * a Map of 'parts' -
     * @param  {Driver} driver Neo4j Driver
     * @param  {Map}    parts  [description]
     * @return {[type]}        [description]
     */
    constructor(driver, parts) {
        this.driver = driver;
        this.parts = parts;
    }

    /**
     * The run method of a handler should take the 'parts'
     * of the intent and run a query against the driver.
     *
     * @return {Promise}
     */
    run() {
        const name = this.parts.get('name').value;

        const cypher = `
            MATCH (node:Person) WHERE node.name = {name}
            RETURN node
            LIMIT 10
        `;

        const session = this.driver.session();

        return session.run(cypher, {name})
            .then(res => {
                return res.records.map(row => {
                    return row.get('node').properties;
                });
            })
            .finally(() => session.close());
    }

}

module.exports = ListPeopleByNameHandler;