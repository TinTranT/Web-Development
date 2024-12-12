import db from '../utils/db.js';

export default { 
    findbyNewId(id) { 
        return db('comment').where('NewsID', id).orderBy('Date', 'desc');
    }
}