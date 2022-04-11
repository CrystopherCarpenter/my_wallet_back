import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { userRepository } from '../repositories/userRepository.js';
import { authRepository } from '../repositories/authRepository.js';

export async function signin(req, res) {
    const { email, password } = req.body;

    try {
        const {
            rows: [user],
        } = await userRepository.getUserByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = uuid();

            await authRepository.createSession(token, user.id);

            return res.send({ token });
        } else {
            return res.sendStatus(401);
        }
    } catch {
        return res.sendStatus(500);
    }
}

export async function logout(req, res) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
        await authRepository.deleteSession(token);

        return res.sendStatus(201);
    } catch {
        return res.sendStatus(500);
    }
}

export async function authToken(req, res) {
    return res.sendStatus(200);
}
