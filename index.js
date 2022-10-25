import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import { leadsRouter } from "./routers/leads.js";
import { usersRouter } from "./routers/users.js";
import { serviceRequestRouter } from "./routers/serviceRequests.js";
import { loginRouter } from "./routers/login.js";
import { signUpRouter } from "./routers/signup.js";
import { forgotPasswordRouter } from "./routers/forgotPassword.js"
import { resetPasswordRouter } from "./routers/resetPassword.js"
import { auth } from "./middleware/auth.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3001;

//--------------------------------------------------------------------------

app.use(cors());
app.use(express.json());

//  --------------------------------------------------------------------------
// Mongo DB connection
const MONGO_URL = process.env.MONGO_URL;

async function createConnect() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb connected!");
    return client;
}
export const client = await createConnect();

// ------------------------------------------------------------------------------

app.get("/", (request, response) => {
    response.send("Hello World...");
})

// Authentication
app.use("/login", loginRouter)
app.use("/sign-up", signUpRouter)
app.use("/forgot-password", forgotPasswordRouter)
app.use("/reset-password", resetPasswordRouter)

// Authorization
app.use("/leads", auth, leadsRouter);
app.use("/users", auth, usersRouter);
app.use("/service-requests", auth, serviceRequestRouter);

app.listen(PORT, () => console.log("App is started in ", PORT));
