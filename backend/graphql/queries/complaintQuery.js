const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");
const Complaint = require("../../models/Complaint");

const ComplaintType = new GraphQLObjectType({
  name: "Complaint",
  fields: () => ({
    id: { type: GraphQLInt },
    tenant_id: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

const complaintQuery = {
  complaints: {
    type: new GraphQLList(ComplaintType),
    resolve() {
      return Complaint.findAll();
    }
  }
};

module.exports = { complaintQuery, ComplaintType };