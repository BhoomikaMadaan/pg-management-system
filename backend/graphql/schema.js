const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require("graphql");
const Room = require("../models/Room");

const RoomType = new GraphQLObjectType({
  name: "Room",
  fields: () => ({
    id: { type: GraphQLString },
    room_number: { type: GraphQLString },
    capacity: { type: GraphQLString },
    rent: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    rooms: {
      type: new GraphQLList(RoomType),
      resolve(parent, args) {
        return Room.findAll();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});