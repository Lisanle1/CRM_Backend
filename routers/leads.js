import express from "express";
import { createLeadsById, getAllLeads, deleteLead, updateLeadsById, getAdmins } from "../helper.js";
import sgMail from "@sendgrid/mail"
import nodemailer from "nodemailer";

const router = express.Router();

router.route("/").get(async (request, response) => {
    const leadsList = await getAllLeads();
    response.send(leadsList);
}).post(async (request, response) => {
    const data = request.body;
    const result = await createLeadsById(data);
    const getUsers = await getAdmins()
    const email = getUsers.map(user => user.email)          //to get admin & manager emails
    if (email) {
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:"test1hmail@gmail.com",
                pass:"bcpn beqk zixw utji"
            }
        });
        
        var mailOptions={
            from:"test1hmail@gmail.com",
            to:email,
            subject:"sending email from nodejs",
            html: `<h2>Below is the new Lead generated from our end.</h2>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Contact: ${data.contact}</p>
            <p>Company: ${data.company}</p>
            <p>Status: ${data.status}</p>`     
        };
        transporter.sendMail(mailOptions, ((err,info)=>{
            if(err){
                response.send({StatusCode:500,msg:"Message not send"})
            }
            else{
                response.send({StatusCode:200,msg:"Message sended successfully"})
            }
        }))
    }
    response.send(result);
})

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params
    const result = await deleteLead(id);
    response.send(result);
}).put(async (request, response) => {
    const { id } = request.params;                                  //Destructured the request
    const { status } = request.body;
    try {
        const result = await updateLeadsById(id, status)
        response.send(result);
    }
    catch (err) {
        response.status(500).send(err)
    }
})

export const leadsRouter = router;