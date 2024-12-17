import db from '../utils/db.js';

export default {
    findall() {
        return db('news').orderBy('PublishDate', 'desc');
    },
    findAll(limit,offset) {
        return db('news').orderBy('PublishDate', 'desc').limit(limit).offset(offset);
    },

    findby3() {
        return db('news').orderBy('PublishDate', 'desc').limit(3);
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
    hotNews() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const list = db('news')
            .where('PublishDate', '>=', sevenDaysAgo)
            .orderBy([
                { column: 'viewCount', order: 'desc' },
                { column: 'PublishDate', order: 'desc' }
            ])
            .offset(4)
            .limit(16);
        return list;
    },
    latestNews() {
        return db('news').orderBy('PublishDate', 'desc').limit(10);
    },
    hotCategories() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

        return db('news')
            .join('Category', 'news.CatID', 'Category.CatID')
            .join('Category as ParentCat', 'Category.CatParentID', 'ParentCat.CatID')
            .select(
                'news.*',
                'Category.CatName',
                'ParentCat.CatName as CatParentName'
            )
            .where('news.PublishDate', '>=', sevenDaysAgo)
            .orderBy('news.viewCount', 'desc');
    },
    hotCategoriesParent() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

        return db('news')
            .join('Category', 'news.CatID', 'Category.CatID')
            .join('Category as ParentCat', 'Category.CatParentID', 'ParentCat.CatID')
            .select(
                'ParentCat.CatID as ParentID',
                'ParentCat.CatName as ParentName',
                db.raw('COUNT(news.NewsID) as NewsCount')
            )
            .where('news.PublishDate', '>=', sevenDaysAgo)
            .groupBy('ParentCat.CatID', 'ParentCat.CatName')
            .orderBy('NewsCount', 'desc')
            .limit(10);  // Get top 5 hot parent categories
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
    findPageByTagId(tagId, limit, offset) {
        return db('news')
        .join('newstag', 'news.NewsID', 'newstag.NewsID')
        .where('newstag.TagID', tagId)
        .select('news.*') // Chỉ lấy thông tin từ bảng news
        .orderBy('news.PublishDate', 'desc')
        .limit(limit)
        .offset(offset);
    },
    relatedNews(id) {
        return db('news')
            .where('NewsID', '<>', id)
            .orderBy('PublishDate', 'desc')
            .limit(5);
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
    },
    del(id){
        return db('news').where('NewsID', id).del()
    },
}