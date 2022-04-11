import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function createRecord({ type, value, description, userId }) {
    const query = format(
        `INSERT INTO transactions (type, value, description, "userId")
        VALUES (?, ?, ?, ?)`,
        [type, value, description, userId]
    );

    return connection.query(query);
}

async function getRecords(userId) {
    const query = format(`SELECT * FROM transactions WHERE "userId" = ?`, [
        userId,
    ]);

    return connection.query(query);
}

export const recordRepository = {
    createRecord,
    getRecords,
};
