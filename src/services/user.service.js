import db from '../utils/db.js';

const checkLinkedAccount = async (provider, subject) => {
    const cred = await db('federated_credentials')
        .where('provider', provider)
        .andWhere('subject', subject).select("user_id");

    if (cred.length === 0) return null;
    return cred[0];
}

const addLinkedAccount = (credential) => {
    return db('federated_credentials').insert(credential).returning('id');
}

const findUserByEmail = async (email) => {
    const users = await db('users').where('email', email);
    if (users.length === 0) return null;
    return users[0];
}

const findUserById = async (id) => {
    const users = await db('users').where('id', id);
    if (users.length === 0) return null;
    return users[0];
}

const add = async (user) => {
    if (user.role == null) {
        user.role = "STUDENT";
    }

    return db('users').insert(user).returning("*");
}

export default {
    add,
    checkLinkedAccount,
    addLinkedAccount,
    findUserByEmail,
    findUserById
}