const graphqlExpress = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const actions = require("./taskActions");

var schema = buildSchema(`
    type Query {
        all(userId: String!): [Task]
        filter(userId: String!, status: String!): [Task]
    },
    type Mutation {
        add(userId: String!, name: String!, status: String!, start: String!, stop: String!): Task
        update(userId: String!, taskId: String!, name: String!, status: String!, start: String!, stop: String!, savedFiles: [String]): Task
        delete(userId: String!, taskId: String!): Task
    },
    type Task {
        _id: String
        user: String
        name: String
        status: String
        start: String
        stop: String
        files: [String]
    },
    type User {
        _id: String
        email: String
        username: String
    }
`);

var rootResolver = {
    all: actions.getAllTasks,
    filter: actions.getFilteredTasks,
    add: actions.addTask,
};

exports.Create = function () {
    return graphqlExpress({
        schema: schema,
        rootValue: rootResolver,
        graphiql: true
    })
};