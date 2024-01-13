import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { User } from "./User.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express();
const PORT = 3000;

const expressServer = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

mongoose.connect('mongodb://127.0.0.1:27017/users');

const io = new Server(expressServer);

io.on("connection", async (socket) => {
    socket.emit("message", `WELLCOME TO CHAT`)
    socket.on("enterRoom", async ({ username, room }) => {
        await User.create({
            username,
            room,
        });
        console.log(`Your username is ${username} and your Room is ${room} and your id is ${socket.id}`);
        io.emit("roomList", await getAllRooms());
        io.emit("userList", await getAllUsers());
    });
});

const getAllRooms = async () => {
    const rooms = await User.find();
    return rooms.map(room => room.room);
}

const getAllUsers = async () => {
    const users = await User.find();
    return users.map(user => user.username);
}

const getAll = async () => {
    return await User.find({}, ["-_id", "-__v"], ["room", "username"]);
    // const usernames = users.map(user => user.username);
    // const rooms = users.map(user => user.username);
    // console.log(users)
}
