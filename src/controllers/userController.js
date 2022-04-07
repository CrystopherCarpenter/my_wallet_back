import db from '../db.js';
import { stripHtml } from 'string-strip-html';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const user = req.body;

    user.name = stripHtml(user.name).result.trim();

    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        await db
            .collection('users')
            .insertOne({ ...user, [password]: passwordHash });
        return res.send(user).status(201);
    } catch {
        return res.send(user).status(500);
    }
}
