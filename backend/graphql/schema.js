const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { roomQuery } = require("./queries/roomQuery");
const roomMutation = require("./mutations/roomMutation");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...roomQuery
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...roomMutation
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});