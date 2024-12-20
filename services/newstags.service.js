import db from '../utils/db.js'
export default{
    addTag(tags){
        return db('newstag').insert(tags)

    },
    countByTagId(id) {
        return db('newstag').where('TagID', id).count('* as total').first();
    },
    del(id){
        return db('newstag').where('NewsID', id).del()
    },
    getTagsByNewsId(id){
        return db('newstag').where('NewsID', id)
    },
}
