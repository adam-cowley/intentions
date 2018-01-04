// const Intentions = require('neode-intentions');
const Intentions = require('../src');

// Create Neo4j Driver
const neo4j = require('neo4j-driver').v1;
const driver = new neo4j.driver('bolt://localhost:7687', new neo4j.auth.basic('neo4j', 'neo'));

// Create Instance
const instance = new Intentions(driver);

// Register Intent
instance.registerIntent('ListPeopleByName', [
    'Show me all People with name {name}',
    'People with name {name}',
]);

// Register Handler
instance.registerHandler('ListPeopleByName', require('./handlers/ListPeopleByNameHandler'));

// Parse the query string
instance.parse('People with name Adam Cowley')
    .then(intents => {
        return Promise.all( intents.map(({ intent, parts }) => {
            return instance.handle(intent, parts);
        }) );
    })
    .then(console.log)
    .catch(e => console.log('Error:', e.message))
