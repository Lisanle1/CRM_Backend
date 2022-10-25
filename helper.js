import { client } from "./index.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

// password generation
async function generatePassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword;

}

//Users functions
async function getAllUsers() {
    return await client.db("crm").collection("users").find({}).toArray()
}
async function deleteUser(data) {
    return await client.db("crm").collection("users").deleteOne({ _id: ObjectId(data) })
}
async function updateUserById(id, role) {
    return await client.db("crm").collection("users").updateOne({ _id: ObjectId(id) }, { $set: { role: role } })
}

// Leads functions
async function getAllLeads() {
    return await client.db("crm").collection("leads").find({}).toArray();
}
async function createLeadsById(data) {
    return await client.db("crm").collection("leads").insertOne(data);
}
async function deleteLead(data) {
    return await client.db("crm").collection("leads").deleteOne({ _id: ObjectId(data) })
}
async function updateLeadsById(id, status) {
    return await client.db("crm").collection("leads").updateOne({ _id: ObjectId(id) }, { $set: { status: status } })
}

//Requests functions
async function getAllRequests() {
    return await client.db("crm").collection("requests").find({}).toArray()
}
async function createRequestById(data) {
    return await client.db("crm").collection("requests").insertOne(data);
}
async function deleteRequest(data) {
    return await client.db("crm").collection("requests").deleteOne({ _id: ObjectId(data) });
}
async function updateRequestsById(id, status) {
    return await client.db("crm").collection("requests").updateOne({ _id: ObjectId(id) }, { $set: { status: status } })
}

// Admin functions
async function getAdmins() {
    return await client.db("crm").collection("users").find({ role: { $in: ["Admin", "Manager"] } }).toArray()
}

export {
    createLeadsById, generatePassword, getAllLeads, getAllUsers, deleteLead, updateLeadsById, deleteUser, updateUserById,
    getAllRequests, createRequestById, deleteRequest, updateRequestsById, getAdmins
}