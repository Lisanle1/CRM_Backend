import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js"

const router = express.Router();

router.route('/').put(async (req, res) => {
    const { resetLink, newPassword } = req.body;

    if (resetLink) {
        jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, async (err, decodedData) => {       //check jwt token is valid or not
            if (err) {
                return res.send({ message: "Incorrect token or it is expired!" })
            }
            const existUser = await client.db("crm").collection("users").findOne({ resetLink: resetLink })      //to find the user
            if (!existUser) {                                                                                   //return if user doesn't exists
                return res.status(400).send({ message: "User with this token doesn't exists." })
            }
            try {
                const salt = await bcrypt.genSalt(10)                                       //generating 10 random strings
                const hashedPassword = await bcrypt.hash(newPassword, salt)                 //password hashing
                await client.db("crm").collection("users").updateOne(                       //update the new password
                    { resetLink: resetLink },
                    {
                        $set: { password: hashedPassword, resetLink: "" }
                    })
                return res.status(200).send({ message: "Your password has been changed successfully!" })
            }
            catch (err) {
                return res.status(500).send({ message: err })
            }
        })
    }

});

export const resetPasswordRouter = router;