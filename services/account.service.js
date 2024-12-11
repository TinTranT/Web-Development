import db from '../utils/db.js'
export default{
    add(entity){
        return db('account').insert(entity)
    },
    findByName(Name){
        return db('account').where('Name',Name).first()
    }
}