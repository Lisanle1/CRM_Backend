import express from "express";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail"
import { client } from "../index.js"
import nodemailer from "nodemailer";
const router = express.Router();
const CLIENT_URL = "http://localhost:3000"


router.route('/').put(async (req, res) => {
    const { email } = req.body;

    const existUser = await client.db("crm").collection("users").findOne({ email: email }) //to check whether the user is present or not

    if (!existUser) {                                          //return if email not exists
        return res.status(400).send({ message: "User with this email doesn't exists." })
    }

    //creating token
    const token = jwt.sign({ _id: existUser._id }, process.env.RESET_PASSWORD_KEY, { expiresIn: "20m" })
    var transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.ACC_EMAIL,
            pass:process.env.ACC_PASS
        }   
    });
    
    var mailOptions={
        from:process.env.ACC_EMAIL,
        to:req.body.email,
        subject:"sending email from nodejs",
        html: `<h2>Please click on given link to reset your password</h2>
               <p>${CLIENT_URL}/reset-password/${token}</p>`
    };
    transporter.sendMail(mailOptions, ((err,info)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log("Email sent:" + info.response);
        }
    }))

    try {
        await client.db("crm").collection("users").updateOne({ email: email }, { $set: { resetLink: token } })      //update the token in db
        return sgMail
            .send(msg)
            .then(() => {
                return res.send({ message: "Email has been sent!" })        //mail will send only if the token is valid
            })
            .catch((error) => {
                return res.send({ message: error })
            })

    }
    catch (err) {
        return res.status(500).send({ message: err })
    }
});

export const forgotPasswordRouter = router;