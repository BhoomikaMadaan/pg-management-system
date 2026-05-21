const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");
const Payment = require("../../models/Payment");

const PaymentType = new GraphQLObjectType({
  name: "Payment",
  fields: () => ({
    id: { type: GraphQLInt },
    tenant_id: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    month: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

const paymentQuery = {
  payments: {
    type: new GraphQLList(PaymentType),
    resolve() {
      return Payment.findAll();
    }
  }
};

module.exports = { paymentQuery, PaymentType };