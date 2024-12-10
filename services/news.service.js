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
    }
}