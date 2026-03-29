const { GraphQLString, GraphQLInt } = require("graphql");
const Room = require("../../models/Room");
const { RoomType } = require("../queries/roomQuery");

const roomMutation = {
  addRoom: {
    type: RoomType,
    args: {
      room_number: { type: GraphQLString },
      capacity: { type: GraphQLInt },
      rent: { type: GraphQLInt }
    },
    resolve(parent, args) {
      return Room.create({
        room_number: args.room_number,
        capacity: args.capacity,
        rent: args.rent
      });
    }
  }
};

module.exports = roomMutation;