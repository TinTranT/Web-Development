import db from '../utils/db.js';

export default {
    findall() {
        return db('news').orderBy('PublishDate','desc');
    },

    findby3() {
        return db('news').orderBy('PublishDate','desc').limit(3);
    },
    featuredNews() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        return db('news')
            .where('PublishDate', '>=', sevenDaysAgo)
            .orderBy([
                { column: 'viewCount', order: 'desc' },
                { column: 'PublishDate', order: 'desc' }
            ])
            .limit(4);
    },
    findbyId(id) {
        return db('news').where('NewsID', id).first();
    },
    countByCatId(id) {
        return db('news').where('CatID', id).count('* as total').first();
    },
    findPageByCatId(id, limit, offset) {
        return db('news').where('CatID', id).limit(limit).offset(offset);
    },
    addNews(entity){
        return db('news').insert(entity)
    },
    findlast(){
        return db('news')
        .orderBy('NewsID', 'desc') // Sắp xếp giảm dần theo id
        .first() // Lấy dòng đầu tiên từ kết quả

    },
    findTagById(id){
        return db('newstag').select('TagID').where('NewsID',id)
    },
    findCategoryById(id){
        return db('news').where('NewsID', id).select('CatID').then(result => result[0]);
    },
    updateNews(id, entity){
        return db('news').where('NewsID', id).update(entity)
    },
    delTag(id)
    {
        return db('newstag').where('NewsID', id).del()
    }
}