import express from "express";
import { getAllUsers, deleteUser, updateUserById } from "../helper.js";

const router = express.Router();

router.route("/").get(async (request, response) => {
    const usersList = await getAllUsers();
    response.send(usersList);
})

router.route("/:id").delete(async (request, response) => {
    const { id } = request.params
    const result = await deleteUser(id);
    response.send(result);
}).put(async (request, response) => {
    const { id } = request.params;                                  //Destructured the request
    const { role } = request.body;
    try {
        const result = await updateUserById(id, role)
        response.send(result);
    }
    catch (err) {
        response.status(500).send(err)
    }

})

export const usersRouter = router;