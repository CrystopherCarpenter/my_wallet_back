import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/userRepository.js';

export async function createUser(req, res) {
    const user = req.body;

    const passwordHash = bcrypt.hashSync(user.password, 10);

    console.log(user);

    try {
        const {
            rows: [validation],
        } = await userRepository.getUserByEmail(user.email);

        if (validation) {
            return res.sendStatus(401);
        }

        await userRepository.createUser({ ...user, password: passwordHash });

        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}
