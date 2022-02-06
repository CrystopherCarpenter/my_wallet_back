import express from "express";
import cors from "cors";
import { MongoClient} from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import dayjs from "dayjs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
  db = mongoClient.db("my_wallet");
});

app.post("/signup", async (req, res) => {
  const user = req.body;

  const passwordHash = bcrypt.hashSync(user.password, 10);

  await db.collection("users").insertOne({ ...user, password: passwordHash });

  res.sendStatus(201);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();

    await db.collection("sessions").insertOne({ token, userId: user._id });

    res.send(token);
  } else {
    res.sendStatus(401);
  }
});

app.get("/mywallet", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  const userRecords = await db.collection("records").find({ userId: session.userId }).toArray();
  
  const user = await db.collection("users").findOne({ _id: session.userId });

  userRecords.forEach((record) => {
    delete record._id;
    delete record.userId;
  })

  res.send({name: user.name, records: userRecords});
});

app.post("/newdata", async (req, res) => {
  const day = dayjs().format("DD/MM");
  const record = { ...req.body, day };
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  await db.collection("records").insertOne({ ...record, userId: session.userId });

  const sessions =  await db.collection("sessions").find({}).toArray();

  res.send(sessions);

});

app.post("/logout", async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  const session = await db.collection("sessions").findOne({ token });
  if (!session) {
    return res.sendStatus(401);
  }
  
  await db.collection("sessions").deleteOne({ token });
  
  return res.sendStatus(200);
})

app.listen(5000);
