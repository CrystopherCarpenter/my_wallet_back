import db from '../db.js';
import { stripHtml } from 'string-strip-html';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const user = req.body;

    try {
        const passwordHash = bcrypt.hashSync(user.password, 10);

        await db
            .collection('users')
            .insertOne({ ...user, password: passwordHash });

        return res.send(user).status(201);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}
