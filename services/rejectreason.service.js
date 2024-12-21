import db from '../utils/db.js';

export default {
    findRejectById(id){
        return db('rejectreason').where('NewsID',id).select('*').first()
    },
    addReject(reject){
        return db('rejectreason').insert(reject);
    },
}