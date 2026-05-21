const express = require("express");
const router = express.Router();

const User = require("../models/User");

router.post("/signup", async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        res.status(201).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
});

module.exports = router;