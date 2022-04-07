import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import db from '../db.js';

export async function signin(req, res) {
    const { email, password } = req.body;

    const user = await db.collection('users').findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = uuid();

        try {
            await db
                .collection('sessions')
                .insertOne({ token, userId: user._id });
            res.send({ token });
        } catch {
            res.sendStatus(500);
        }
    } else {
        res.sendStatus(401);
    }
}

export async function logout(req, res) {
    const token = req.headers.replace('Bearer ', '');

    try {
        await db.collection('sessions').deleteOne({ token });
        return res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}
