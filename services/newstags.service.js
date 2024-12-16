import db from '../utils/db.js'
export default{
    addTag(tags){
        return db('newstag').insert(tags)

    },
}