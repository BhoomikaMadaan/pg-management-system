let io;

module.exports = {
    /**
     * Store the Socket.io instance
     * @param {Object} socketIoInstance - The initialized Socket.io instance
     * @returns {Object} The stored instance
     */
    init: (socketIoInstance) => {
        io = socketIoInstance;
        return io;
    },

    /**
     * Retrieve the initialized Socket.io instance
     * @returns {Object} The Socket.io instance
     * @throws {Error} If init() hasn't been called yet
     */
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io is not initialized! Make sure to call init() first in server.js.");
        }
        return io;
    }
};
