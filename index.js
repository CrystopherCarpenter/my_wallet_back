import express from 'express';
import cors from 'cors';
import joi from 'joi';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

// eslint-disable-next-line no-undef
const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

mongoClient.connect(() => {
        db = mongoClient.db('');
});

app.listen(5000);
