const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");

// Some fake data
let todos = [
  {
    id: 1,
    todo: "Drink Beer",
    done: false
  },
  {
    id: 2,
    todo: "Eat cheese",
    done: false
  },
  {
    id: 3,
    todo: "Make soup",
    done: false
  }
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { todos: [Todo], todo(id: Int!): Todo }
  type Todo { id: Int!, todo: String!, done: Boolean! }
  type Mutation {  
      addTodo(todo: String!): [Todo], 
      removeTodo(id: Int!): [Todo], 
      editTodo(id: Int!, todo: String, done: Boolean): [Todo] 
    }
`;

// The resolvers
const resolvers = {
  Query: {
    todos: () => todos,
    todo: (_, { id }) => todos.find(todo => todo.id === id)
  },
  Mutation: {
    addTodo: (_, { todo }) => {
      todos = [
        ...todos,
        { id: Math.max(...todos.map(elt => elt.id)) + 1, todo, done: false }
      ];
      return todos;
    },
    removeTodo: (_, { id }) => {
      todos = todos.filter(todo => todo.id !== id);
      return todos;
    },
    editTodo: (_, todo) => {
      let editThis = todos.find(elt => elt.id === todo.id);
      if (editThis) {
        todos = todos.map(elt =>
          todo.id === elt.id ? { ...elt, ...todo } : elt
        );
      }
      return todos;
    }
  }
};

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// Initialize the app
const app = express();

// The GraphQL endpoint
app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

// Start the server
app.listen(3000, () => {
  console.log("Go to http://localhost:3000/graphiql to run queries!");
});