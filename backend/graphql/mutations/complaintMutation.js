const { GraphQLInt, GraphQLString } = require("graphql");
const Complaint = require("../../models/Complaint");
const { ComplaintType } = require("../queries/complaintQuery");

const complaintMutation = {

  addComplaint: {
    type: ComplaintType,
    args: {
      tenant_id: { type: GraphQLInt },
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString }
    },
    resolve(parent, args) {
      return Complaint.create({
        tenant_id: args.tenant_id,
        title: args.title,
        description: args.description,
        status: args.status
      });
    }
  },

  deleteComplaint: {
    type: GraphQLString,
    args: {
      id: { type: GraphQLInt }
    },
    async resolve(parent, args) {
      await Complaint.destroy({
        where: { id: args.id }
      });
      return "Complaint deleted successfully";
    }
  }

};

module.exports = complaintMutation;