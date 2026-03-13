const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { roomQuery } = require("./queries/roomQuery");
const roomMutation = require("./mutations/roomMutation");
const { tenantQuery } = require("./queries/tenantQuery");
const tenantMutation = require("./mutations/tenantMutation");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...roomQuery,
    ...tenantQuery
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...roomMutation,
    ...tenantMutation
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});