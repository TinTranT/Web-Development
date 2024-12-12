import db from '../utils/db.js';

export default {
    findall() {
        return db('category');
    },
    findById(id) {
        return db('category').where('CatID', id).first();
    },
    findbyNewsId(id) {
        return db('category')
            .join('news', 'category.CatID', 'news.CatID')
            .where('news.NewsID', id)
            .select('category.*') // Chỉ lấy thông tin từ bảng category
            .orderBy('category.CatName', 'asc')
            .first();
    }
}