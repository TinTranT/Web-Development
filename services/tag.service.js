import db from '../utils/db.js';

export default {
    findall() {
        return db('tag');
    },
    findById(id) {
        return db('tag').where('TagId', id).first();
    },
    findByNewsId(newsId) {
        return db('tag')
            .join('newstag', 'tag.TagID', 'newstag.TagID')
            .where('newstag.NewsID', newsId)
            .select('tag.*') // Chỉ lấy thông tin từ bảng tag
            .orderBy('tag.TagName', 'asc');
    }

}