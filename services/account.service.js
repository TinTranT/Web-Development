import db from '../utils/db.js';

export default {
    findByEmail(email) {
        return db('account').where('Email', email).first();
    },

    add(entity) {
        return db('account').insert(entity);
    },

    update(entity) {
        return db('account')
            .where('Id', entity.Id)
            .update(entity);
    },

    updatePassword(entity) {
        return db('account')
            .where('Id', entity.Id)
            .update({ Password: entity.Password });
    },

    findPageByRole(role, limit, offset) {
        return db('account').where('Role', role).limit(limit).offset(offset);
    },

    countbyRole(role) {
        return db('account').where('Role', role).count('* as total');
    }
}