const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const { roomQuery } = require("./queries/roomQuery");
const roomMutation = require("./mutations/roomMutation");
const { tenantQuery } = require("./queries/tenantQuery");
const tenantMutation = require("./mutations/tenantMutation");
const { complaintQuery } = require("./queries/complaintQuery");
const complaintMutation = require("./mutations/complaintMutation");
const { paymentQuery } = require("./queries/paymentQuery");
const paymentMutation = require("./mutations/paymentMutation");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    ...roomQuery,
    ...tenantQuery,
    ...complaintQuery,
    ...paymentQuery
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    ...roomMutation,
    ...tenantMutation,
    ...complaintMutation,
    ...paymentMutation
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});