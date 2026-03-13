const { GraphQLInt, GraphQLString } = require("graphql");
const Tenant = require("../../models/Tenant");
const { TenantType } = require("../queries/tenantQuery");

const tenantMutation = {
    //ADD TENANT
  addTenant: {
    type: TenantType,
    args: {
      user_id: { type: GraphQLInt },
      room_id: { type: GraphQLInt },
      join_date: { type: GraphQLString }
    },
    resolve(parent, args) {
  return Tenant.create({
    user_id: args.user_id,
    room_id: args.room_id,
    join_date: args.join_date
  }).then(tenant => ({
    ...tenant.dataValues,
    join_date: new Date(tenant.join_date).toISOString().split("T")[0]
  }));
}
},

// DELETE TENANT
  deleteTenant: {
    type: GraphQLString,
    args: {
      id: { type: GraphQLInt }
    },
    async resolve(parent, args) {
      await Tenant.destroy({
        where: { id: args.id }
      });
      return "Tenant deleted successfully";
    }
  }

};

  
module.exports = tenantMutation;