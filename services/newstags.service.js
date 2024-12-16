import db from '../utils/db.js'
export default{
    addTag(tags){
        return db('newstag').insert(tags)

    },
    countByTagId(id) {
        return db('newstag').where('TagID', id).count('* as total').first();
    },
}
