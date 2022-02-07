import express from "express";
import cors from "cors";
import { MongoClient} from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import joi from "joi";
import { stripHtml } from "string-strip-html";
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

const signupSchema = joi.object({
  name: joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),

  password: joi.string()
    .pattern(/^[a-zA-Z0-9]{3,30}$/)
    .required(),

  email: joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
})

const newDataSchema = joi.object({
  value: joi.number()
    .positive()
    .required(),
  
    description: joi.string()
    .required(),

  type: joi.string()
    .required()
})

app.post("/signup", async (req, res) => {
  const user = req.body;

  const validation = signupSchema.validate(user);
  if (validation.error) {
    return res.send(validation.error).status(422);
  }
  
  user.name = stripHtml(user.name).result.trim();

  const passwordHash = bcrypt.hashSync(user.password, 10);

  try {
    await db.collection("users").insertOne({ ...user, password: passwordHash });
    res.sendStatus(201);
  } catch {
    res.sendStatus(500)
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.collection("users").findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = uuid();

   try{ await db.collection("sessions").insertOne({ token, userId: user._id });
     res.send({ token });
     } catch {
    res.sendStatus(500)
  }
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
    delete record.userId;
  })

  res.send({name: user.name, records: userRecords});
});

app.post("/newdata", async (req, res) => {
  const day = dayjs().format("DD/MM");
  const record = { ...req.body, day };
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  const validation = newDataSchema.validate(req.body);
  if (validation.error) {
    return res.send(validation.error).status(422);
  }

  record.description  = stripHtml(record.description).result.trim();

  if (!token) {
    return res.sendStatus(401);
  }

  const session = await db.collection("sessions").findOne({ token });

  if (!session) {
    return res.sendStatus(401);
  }

  try { await db.collection("records").insertOne({ ...record, userId: session.userId });
  res.sendStatus(201);
     } catch {
    res.sendStatus(500)
  }

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
  
  try { await db.collection("sessions").deleteOne({ token });
  return res.sendStatus(201);
     } catch {
    res.sendStatus(500)
  }
  })

app.get("/users", async (req, res) => {
  res.send(await db.collection("users").find({}).toArray())
})

app.listen(5000);
