import db from '../db.js';

export async function getData(req, res) {
    const { user } = res.locals;

    try {
        const userRecords = await db
            .collection('records')
            .find({ userId: user.id })
            .toArray();

        userRecords.forEach((record) => {
            delete record.userId;
        });

        return res.send({ name: user.name, records: userRecords }).status(200);
    } catch {
        return res.status(500);
    }
}

export async function createData(req, res) {
    const { user } = res.locals;
    const day = dayjs().format('DD/MM');
    const record = { ...req.body, day, userId: user.id };

    record.description = stripHtml(record.description).result.trim();

    try {
        await db.collection('records').insertOne({ record });
        res.sendStatus(201);
    } catch {
        res.sendStatus(500);
    }
}
