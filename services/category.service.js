import db from '../utils/db.js';

export default {
    findall() {
        return db('category');
    }
}