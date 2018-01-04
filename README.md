# Intentions

> he road to hell is paved with good intentions.

A lightweight library to provide Alexa Intent-style searches for Neo4j in Node.

## Getting Started

The idea is to first provide a set of `Intent`s.  An Intent is set of phrases that are used as listeners.  This could be the intent to search the database or to add a product to a basket.

Each phrase has zero, one or more `Slot`s  that can be used within the query.  Slots are surrounded in the original string by `{braces}` and can be cast as a type.

Slots are replaced with regex patterns which are then matched against a query string.

### Why doesn't this use NLP?

It turns out structuring NLP queries to do this kind of thing are difficult.


### Slot Types

Type | Description | Example
-- | -- | --
Label | Any label | `Show me all {label#Label}`
Node | Takes an additional label to search with | `Show me all People that live in {location#Node:Location}`
Number | Takes a value and attempts to convert to a number before searching | `Show me People aged {age:Number}`
Currency | Matches a value with a currency symbol before or after | `Show me Employees with a salary of greater than {salary:Currency}`
Property | Takes a property name | `Show me all {label:Label} with {property:Property} {condition:Condition} {value:Anything}`
Condition | Searches for a condition string, for example _greater than_ | `People with age {condition:Condition} {age:Number}`
Anything | Will match anything `(.*)`.  Also used as a fallback option when no type is supplied.   | `Show me all People with a {key#Property} of {value#Anything}`

## Example

See `example/index.js`

## TODO

- Refine search interface
- More Slot types
- Generic handlers
- Implement property type in Node search. eg `{location#Node:Location.name}`
- Language support