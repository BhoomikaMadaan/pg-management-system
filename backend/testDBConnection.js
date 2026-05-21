const sequelize = require("./config/database");
const fs = require("fs");

sequelize.authenticate()
    .then(() => {
        fs.writeFileSync("testDBResult.txt", "SUCCESS: Database connected!");
        process.exit(0);
    })
    .catch(err => {
        fs.writeFileSync("testDBResult.txt", "ERROR: " + err.message);
        process.exit(1);
    });
