const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");
const Tenant = require("../../models/Tenant");

const TenantType = new GraphQLObjectType({
  name: "Tenant",
  fields: () => ({
    id: { type: GraphQLInt },
    user_id: { type: GraphQLInt },
    room_id: { type: GraphQLInt },
    join_date: { type: GraphQLString }
  })
});

const tenantQuery = {
  tenants: {
    type: new GraphQLList(TenantType),
    resolve() {
  return Tenant.findAll().then(tenants => {
    return tenants.map(t => ({
      ...t.dataValues,
      join_date: new Date(t.join_date).toISOString().split("T")[0]
    }));
  });
}
  }
};

module.exports = { tenantQuery, TenantType };