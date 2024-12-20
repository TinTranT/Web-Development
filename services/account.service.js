import db from '../utils/db.js';

export default {
    findByEmail(email) {
        return db('account').where('Email', email).first();
    },
    findById(id) {
        return db('account').where('Id', id).first();
    },

    add(entity) {
        return db('account').insert(entity);
    },

    update(entity) {
        return db('account')
            .where('Id', entity.Id)
            .update(entity);
    },
    patch(id, entity) {
        return db('account')
            .where('Id', id)
            .update(entity);
    },
    del(id) {
        return db('account')
            .where('Id', id)
            .del();
    },

    updatePassword(entity) {
        return db('account')
            .where('Id', entity.Id)
            .update({ Password: entity.Password });
    },

    updateOTP(id, otp) {
        return db('account').where('Id', id).update({
            OTP: otp,
            OTP_CreatedAt: db.fn.now()
        });
    },

    deleteOTPByEmail(email) {
        return db('account').where('Email', email).update({
            OTP: null,
            OTP_CreatedAt: null
        });
    },

    updatePasswordByEmail(email, password) {
        return db('account').where('Email', email).update({ Password: password });
    },

    findPageByRole(role, limit, offset) {
        return db('account').where('Role', role).limit(limit).offset(offset);
    },

    countByRole(role) {
        return db('account').where('Role', role).count('* as total').first();
    }

}