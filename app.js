
const express = require('express');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { query } = require('./schemas/queries');
const { mutation } = require('./schemas/mutations');

const { GraphQLSchema } = graphql

const schema = new GraphQLSchema({
    query,
    mutation
});

const app = express();

app.use('/api',

    graphqlHTTP({
        schema: schema,
        graphiql: true
    }));

app.listen(3000, () => {
    console.log('GraphQL server rurring on localhost:3000');
})