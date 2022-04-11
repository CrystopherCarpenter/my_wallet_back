import { authRepository } from '../repositories/authRepository.js';
import { userRepository } from '../repositories/userRepository.js';

export default async function validateToken(req, res, next) {
    const authorization = req.headers.authorization;
    const token = authorization?.replace('Bearer ', '');
    if (!token) {
        return res.sendStatus(401);
    }
    const {
        rows: [session],
    } = await authRepository.getSession(token);
    if (!session) {
        return res.sendStatus(401);
    }
    const {
        rows: [user],
    } = await userRepository.getUserById(session?.userId);
    if (!user) {
        return res.sendStatus(401);
    }
    res.locals.user = user;

    next();
}
