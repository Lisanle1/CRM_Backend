import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js"

const router = express.Router();

router.route('/').post(async (req, res) => {
    const { email, password } = req.body;
    const existUser = await client.db("crm").collection("users").findOne({ email: email });   //to find the user

    if (!existUser) {
        return res.status(400).send({ message: "Cannot find user" })
    }

    try {
        if (await bcrypt.compare(password, existUser.password)) {
            const token = await jwt.sign({ existUser }, process.env.SECRET_KEY, { expiresIn: 86400 })       //creating token
            res.status(200).send({ message: "Success", token: token })
        }
        else {
            res.status(400).send({ message: "Invalid Credentials!" })
        }
    }
    catch (err) {
        res.status(500).send(err)
    }
})

export const loginRouter = router;