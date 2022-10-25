import express from "express";
import bcrypt from "bcrypt";
import { client } from "../index.js"

const router = express.Router();

router.route('/').post(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const user = await client.db("crm").collection("users").findOne({ email: email });      //to find user

    if (user) {
        return res.status(409).send({ message: "User with email already exists" })
    }

    // Password Hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const data = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        role: "",
        resetLink: ""
    }

    await client.db("crm").collection("users").insertOne(data);
    res.send({ message: "Account created successfully!" })
});

export const signUpRouter = router;