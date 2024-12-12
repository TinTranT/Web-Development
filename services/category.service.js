import db from '../utils/db.js';

export default {
    findall() {
        return db('category');
    },
    findById(id) {
        return db('category').where('CatID', id).first();
    },
}