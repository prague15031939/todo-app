const graphqlExpress = require("express-graphql").graphqlHTTP;
const { buildSchema } = require("graphql");
const taskActions = require("./taskActions");
const userActions = require("./userActions");

var schema = buildSchema(`
    type Query {
        all: [Task]
        filter(status: String!): [Task]
        current: User
    },
    type Mutation {
        add(name: String!, status: String!, start: String, stop: String!): Task
        update(taskId: String!, name: String!, status: String!, start: String!, stop: String!, savedFiles: [String]): Task
        delete(taskId: String!): Task
        login(email: String!, password: String!): String
        register(email: String!, username: String!, password: String!): String
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
        id: String
        email: String
        username: String
    }
`);

var rootResolver = {
    all: taskActions.getAllTasks,
    filter: taskActions.getFilteredTasks,
    add: taskActions.addTask,
    update: taskActions.updateTask,
    delete: taskActions.deleteTask,  
    login: userActions.loginUser,
    register: userActions.registerUser,
    current: userActions.getCurrentUser
};

exports.Create = function () {
    return graphqlExpress({
        schema: schema,
        rootValue: rootResolver,
        graphiql: true
    })
};