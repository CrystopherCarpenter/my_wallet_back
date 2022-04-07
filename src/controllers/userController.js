import db from '../db.js';
import { stripHtml } from 'string-strip-html';
import bcrypt from 'bcrypt';

export async function createUser(req, res) {
    const user = req.body;

    user.name = stripHtml(user.name).result.trim();

    const passwordHash = bcrypt.hashSync(user.password, 10);

    try {
        const validation = await db
            .collection('users')
            .findOne({ email: user.email });
        if (validation) {
            return res.sendStatus(401);
        }

        await db
            .collection('users')
            .insertOne({ ...user, [password]: passwordHash });

        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}
