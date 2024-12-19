import db from '../utils/db.js';

export default { 
    findbyNewId(id) { 
        return db('comment')
            .join('account', 'comment.AccountID', '=', 'account.Id')
            .select('comment.*', 'account.Name as AccountName')
            .where('comment.NewsID', id)
            .orderBy('comment.Date', 'desc');
    },
    add(entity) {
        return db('comment').insert(entity);
    },
}