import db from '../utils/db.js'
export default{ 
    findbyAccountID(AccountID){
        return db('editorcategory').where('AccountID',AccountID);
    },
    del(AccountID){
        return db('editorcategory').where('AccountID',AccountID).del();
    },
    add(category){
        return db('editorcategory').insert(category);
    },
};