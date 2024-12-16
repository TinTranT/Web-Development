import db from '../utils/db.js';

export default {
    countByTagId(id) {
        return db('newstag').where('TagID', id).count('* as total').first();
    },
}