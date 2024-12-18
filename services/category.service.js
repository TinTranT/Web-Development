import db from '../utils/db.js';

export default {
    findall() {
        return db('category');
    },
    findById(id) {
        return db('category').where('CatID', id).first();
    },
    findNoParent() {
        return db('category').whereNull('CatParentID');
    },
    findWithParent() {
        return db('category as c1')
            .leftJoin('category as c2', 'c1.CatParentID', 'c2.CatID')
            .whereNotNull('c1.CatParentID')
            .select(
                'c1.CatID',
                'c1.CatName',
                'c2.CatName as CatParentName'
            )
            .orderBy('c1.CatID', 'asc');
    },
    findbyNewsId(id) {
        return db('category')
            .join('news', 'category.CatID', 'news.CatID')
            .where('news.NewsID', id)
            .select('category.*') // Chỉ lấy thông tin từ bảng category
            .orderBy('category.CatName', 'asc')
            .first();
    },
    findPagewithParent(limit,offset) {
        return db('category as c1')
            .leftJoin('category as c2', 'c1.CatParentID', 'c2.CatID')
            .select(
                'c1.CatID',
                'c1.CatName',
                'c2.CatName as CatParentName'
            )
            .orderBy('c1.CatID', 'asc')
            .limit(limit).offset(offset);
    },
    countall() {
        return db('category').count('* as total').first();
    },
    add(entity) {
        return db('category').insert(entity);
    },
    del(id) {
        return db('category').where('CatID', id).del();
    },
    countSubCat(id) {
        return db('category').where('CatParentID', id).count('* as total');
    },
    patch(id, changes) {
        return db('category').where('CatID', id).update(changes);
    },
    findGroupCat() {
        return db('category as c1')
            .leftJoin('category as c2', 'c1.CatParentID', 'c2.CatID')
            .select(
                'c1.CatID',
                'c1.CatName',
                'c2.CatName as CatParentName'
            )
    }
}