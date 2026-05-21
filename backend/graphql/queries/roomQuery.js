const { GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");
const Room = require("../../models/Room");

const RoomType = new GraphQLObjectType({
  name: "Room",
  fields: () => ({
    id: { type: GraphQLInt },
    room_number: { type: GraphQLString },
    capacity: { type: GraphQLInt },
    rent: { type: GraphQLInt }
  })
});

const roomQuery = {
  rooms: {
    type: new GraphQLList(RoomType),
    resolve() {
      return Room.findAll();
    }
  }
};

module.exports = { roomQuery, RoomType };