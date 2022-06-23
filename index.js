const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());
app.use(cors()); 

mongoose.connect(process.env.MONGO_URL, {
// mongoose.connect("mongodb+srv://vishakha_251:vishakha@chatapp.bm5ck.mongodb.net/chatapp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  room: String,
  messages:
    [{
      message: String,
      userId: String,
      username: String,
      date: String,
    }]
});

const Chat = mongoose.model("Chat", ChatSchema);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let userList = [];

function insert(room, user, userid) {
  let idx = userList.findIndex(userObj => userObj.room === room);
  if (idx == -1 || idx == userList.length) {
    idx = userList.length;
    userList.push({
      "room": room,
      "users": []
    })
  }
  userList[idx].users.push({
    username: user,
    userId: userid
  })
}

function deleteUserFromRoom(room, userid) {
  let idx = userList.findIndex(userObj => userObj.room === room);
  let index = userList[idx].users.findIndex(users => users.userId === userid);

  userList[idx].users.splice(index, 1);
}

function deleteUser(userId) {
  for (let idx = 0; idx < userList.length; idx++) {
    let index = userList[idx].users.findIndex(users => users.userId === userId);
    if (index != -1 && index != userList[idx].users.length) {
      userList[idx].users.splice(index, 1);
      if (userList[idx].users.length == 0)
        userList.splice(idx, 1);
      return;
    }
  }
}

app.get("/prevChat/:room", async (req, res) => {

  const data = await Chat.find({ room: req.params.room });
  if(data.length !== 0)
  {
    // console.log(data[0].messages);
    res.json(data[0].messages);
  }
  else
    res.json(data);
})

app.post("/newChat", async (req, res) => {

  let data = await Chat.find({ room: req.body.room });
  // console.log(data);
  let prevMsgs;
  if(data.length == 0)
    prevMsgs = undefined;
  else
    prevMsgs = data[0].messages;
  const msg = {
    message: req.body.message,
    userId: req.body.userId,
    username: req.body.username,
    date: req.body.date
  }
  
  if (prevMsgs !== undefined) {
    // console.log("hello");
    prevMsgs.push(msg);
    const updated = await Chat.updateOne({ room: req.body.room }, { $set: { room: req.body.room, messages: prevMsgs } });
    res.json(msg);
  }
  else {
    // console.log("new");
    let list = [];
    list.push(msg);
    prevMsgs = list;
    const newMsges = new Chat({
      room: req.body.room,
      messages: prevMsgs
    })
    newMsges.save();
    res.json(newMsges);
  }
})

app.get("/:room", (req, res) => {

  let room = req.params.room;
  let idx = userList.findIndex(userObj => userObj.room === room);
  if(idx == -1 || idx == userList.length)
    res.json([]);
  else
    res.json(userList[idx].users);
})

io.on("connection", (socket) => {
  console.log(`user with id: ${socket.id} is connected`);

  socket.on("join", (data) => {
    socket.join(data.room);
    console.log(`User with name = ${data.user} ID: ${socket.id} joined room: ${data.room}`);
    insert(data.room, data.user, socket.id);
  })

  socket.on("send", (data) => {
    socket.to(data.room).emit("receive", data);
  });

  socket.on("leave", (data) => {
    socket.leave(data.room);
    console.log(`User with ID: ${socket.id} leaved room: ${data.room}`);
    deleteUserFromRoom(data.room, socket.id);
  });

  socket.on("disconnect", () => {
    deleteUser(socket.id);
    console.log("User Disconnected", socket.id);
  });

})

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
})