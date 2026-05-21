const { GraphQLInt, GraphQLString } = require("graphql");
const Payment = require("../../models/Payment");
const { PaymentType } = require("../queries/paymentQuery");

const paymentMutation = {

  addPayment: {
    type: PaymentType,
    args: {
      tenant_id: { type: GraphQLInt },
      amount: { type: GraphQLInt },
      month: { type: GraphQLString },
      status: { type: GraphQLString }
    },
    resolve(parent, args) {
      return Payment.create({
        tenant_id: args.tenant_id,
        amount: args.amount,
        month: args.month,
        status: args.status
      });
    }
  },

  deletePayment: {
    type: GraphQLString,
    args: {
      id: { type: GraphQLInt }
    },
    async resolve(parent, args) {
      await Payment.destroy({
        where: { id: args.id }
      });
      return "Payment deleted successfully";
    }
  }

};

module.exports = paymentMutation;