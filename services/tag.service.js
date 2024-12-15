import { add } from 'date-fns';
import db from '../utils/db.js';

export default {
    findall() {
        return db('tag').orderBy('TagID', 'asc');
    },
    countall() {
        return db('tag').count('* as total').first();
    },
    findPage(limit,offset) {
        return db('tag')
            .limit(limit).offset(offset)
            .orderBy('TagID', 'asc');

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
    },
    add(entity) {
        return db('tag').insert(entity);
    },
    patch(id, entity) {
        return db('tag').where('TagID', id).update(entity);
    },
    del(id) {
        return db('tag').where('TagID', id).del();
    },

}