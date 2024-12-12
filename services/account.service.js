import db from '../utils/db.js';

export default {
    findByEmail(email) {
        return db('account').where('Email', email).first();
    },

    add(entity) {
        return db('account').insert(entity);
    },

    updatePassword(entity) {
        return db('account')
            .where('Id', entity.Id)
            .update({ Password: entity.Password });
    }
}