const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");   // import database connection
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}));


// Test route
app.get("/", (req, res) => {
    res.send("PG Management System API Running");
});

// Test database connection
sequelize.authenticate()
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});