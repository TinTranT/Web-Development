import db from '../utils/db.js';

export default {
    findRejectById(id){
        return db('rejectreason').where('NewsID',id).select('*').first()
    },
    addReject(reject){
        return db('rejectreason').insert(reject);
    },
    findCountAllRejectedArticles(editorID){
        return db('rejectreason').where('EditorID',editorID).count('* as total');
    },
    findCountRejectedArticlesByCat(catID,editorID){
        return db('rejectreason')
            .leftJoin('news','news.NewsID','rejectreason.NewsID')
            .where('news.CatID',catID)
            .andWhere('rejectreason.EditorID',editorID)
            .count('* as total');
    }
}