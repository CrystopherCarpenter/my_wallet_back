import { recordRepository } from '../repositories/recordRepository.js';

export async function getData(req, res) {
    const { user } = res.locals;

    try {
        const { rows: records } = await recordRepository.getRecords(user.id);

        return res.send({ name: user.name, records }).status(200);
    } catch {
        return res.status(500);
    }
}

export async function createData(req, res) {
    const { id: userId } = res.locals.user;
    const record = { ...req.body, userId };

    try {
        await recordRepository.createRecord(record);
        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}
