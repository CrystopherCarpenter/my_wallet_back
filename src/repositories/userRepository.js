import connection from '../db.js';
import pkg from 'sqlstring';

const { format } = pkg;

async function createUser({ email, password, name }) {
    const query = format(
        `INSERT INTO users (email, password, name)
        VALUES (?, ?, ?)`,
        [email, password, name]
    );

    return connection.query(query);
}

async function getUserByEmail(email) {
    const query = format(`SELECT * FROM users WHERE email = ?`, [email]);

    return connection.query(query);
}

async function getUserById(id) {
    const query = format(`SELECT * FROM users WHERE id = ?`, [id]);

    return connection.query(query);
}

async function getUserByName(name) {
    const query = format(`SELECT * FROM users WHERE name iLIKE ?`, [
        `${name}%`,
    ]);

    return connection.query(query);
}

export const userRepository = {
    createUser,
    getUserByEmail,
    getUserById,
    getUserByName,
};
