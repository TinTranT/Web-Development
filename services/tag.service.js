import db from '../utils/db.js';

export default {
    findall() {
        return db('tag');
    },
    findById(id) {
        return db('tag').where('TagId', id).first();
    },
}