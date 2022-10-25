import express from "express";
import { getAllRequests, createRequestById, deleteRequest, updateRequestsById, getAdmins } from "../helper.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.route("/").get(async (request, response) => {
    const leadsList = await getAllRequests();
    response.send(leadsList);
}).post(async (request, response) => {
    const data = request.body;

    const result = await createRequestById(data);
    const getUsers = await getAdmins()

    const email = getUsers.map(user => user.email)              //to get admin & manager emails
    if (email) {
        var transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.ACC_EMAIL,
                pass:process.env.ACC_PASS
            }
        });
        
        var mailOptions={
            from:process.env.ACC_EMAIL,
            to:email,
            subject: "New new Service Request has been created",
            html: `<h2>Below is the new Service Request generated from our end.</h2>
            <p>Name: ${data.name}</p>
            <p>Email: ${data.email}</p>
            <p>Contact: ${data.request}</p>
            <p>Status: ${data.status}</p>`       
        };
        transporter.sendMail(mailOptions, ((err,info)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("Email sent:" + info.response);
            }
        }))
    }
    response.send(result);
})

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params
    const result = await deleteRequest(id);
    response.send(result);
}).put(async (request, response) => {
    const { id } = request.params;                                          //Destructured the request
    const { status } = request.body;
    try {
        const result = await updateRequestsById(id, status)
        response.send(result);
    }
    catch (err) {
        response.status(500).send(err)
    }

})

export const serviceRequestRouter = router;