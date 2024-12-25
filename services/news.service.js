import db from '../utils/db.js';

export default {
    turnOnEventScheduler() {
        return db.raw('SET GLOBAL event_scheduler = ON;');
    },

    findall() {
        return db('news').orderBy('PublishDate', 'desc');
    },
    findAll(limit, offset) {
        return db('news').orderBy('PublishDate', 'desc').limit(limit).offset(offset);
    },

    findby3() {
        return db('news').orderBy('PublishDate', 'desc').limit(3);
    },
    countAll() {
        return db('news').count('* as total').first();
    },
    featuredNews() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const currentDate = new Date();

        return db('news as n')
            .leftJoin('category as c', 'n.CatID', 'c.CatID') // Liên kết bảng news với category
            .leftJoin('newstag as nt', 'n.NewsID', 'nt.NewsID') // Liên kết bảng news với news_tags
            .leftJoin('tag as t', 'nt.TagID', 't.TagID') // Liên kết bảng news_tags với tags
            .where('n.PublishDate', '>=', sevenDaysAgo)
            .andWhere('n.Status', 3)
            .andWhere('n.PublishDate', '<=', currentDate)
            .select(
                'n.*',
                'c.CatName', // Lấy tên category
                db.raw('GROUP_CONCAT(t.TagName) as Tags') // Gộp các tags thành chuỗi
            )
            .groupBy('n.NewsID') // Nhóm theo bài viết để tránh trùng lặp
            .orderBy([
                { column: 'n.viewCount', order: 'desc' },
                { column: 'n.PublishDate', order: 'desc' }
            ])
            .limit(4); // Giới hạn kết quả trả về 4 bài viết
    },

    hotNews() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const currentDate = new Date();

        return db('news as n')
            .leftJoin('category as c', 'n.CatID', 'c.CatID') // Liên kết bảng news với category
            .leftJoin('newstag as nt', 'n.NewsID', 'nt.NewsID') // Liên kết bảng news với news_tags
            .leftJoin('tag as t', 'nt.TagID', 't.TagID') // Liên kết bảng news_tags với tags
            .where('n.PublishDate', '>=', sevenDaysAgo)
            .andWhere('n.Status', 3)
            .andWhere('n.PublishDate', '<=', currentDate)
            .select(
                'n.*',
                'c.CatName', // Lấy tên category
                db.raw('GROUP_CONCAT(t.TagName) as Tags') // Gộp các tags thành chuỗi
            )
            .groupBy('n.NewsID') // Nhóm theo bài viết để tránh trùng lặp
            .orderBy([
                { column: 'n.viewCount', order: 'desc' },
                { column: 'n.PublishDate', order: 'desc' }
            ])
            .offset(4)
            .limit(16); // Giới hạn kết quả trả về 16 bài viết
    },

    latestNews() {
        const currentDate = new Date();

        return db('news as n')
            .leftJoin('account as a', 'n.WriterID', 'a.Id') // Liên kết với bảng account
            .leftJoin('category as c', 'n.CatID', 'c.CatID') // Liên kết với bảng category
            .where('n.Status', 3)
            .andWhere('n.PublishDate', '<=', currentDate)
            .select(
                'n.*',
                'a.Name', // Tên người viết
                'c.CatName' // Tên mục
            )
            .orderBy('n.PublishDate', 'desc') // Sắp xếp theo PublishDate giảm dần
            .limit(10); // Lấy tối đa 10 bài viết
    },

    hotCategories() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);
        const currentDate = new Date();

        return db('news')
            .join('category', 'news.CatID', 'category.CatID') // Liên kết với bảng category
            .leftJoin('category as ParentCat', 'category.CatParentID', 'ParentCat.CatID') // Liên kết với bảng category cha
            .join('account', 'news.WriterID', 'account.Id') // Liên kết với bảng account để lấy tên người viết
            .where('news.PublishDate', '>=', sevenDaysAgo) // Lọc bài viết trong 14 ngày qua
            .andWhere('news.Status', 3)
            .andWhere('news.PublishDate', '<=', currentDate)
            .select(
                'news.*', // Lấy tất cả các cột từ bảng news
                'category.CatName', // Lấy tên mục
                'ParentCat.CatName as CatParentName', // Lấy tên mục cha
                'account.Name' // Lấy tên người viết
            )
            .orderBy('news.viewCount', 'desc'); // Sắp xếp theo viewCount giảm dần
    },
    hotCategoriesParent() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

        return db('news')
            .join('category', 'news.CatID', 'category.CatID')
            .join('category as ParentCat', 'category.CatParentID', 'ParentCat.CatID')
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
    countByCatIdFillGuest(id) {
        const currentDate = new Date();
        return db('news')
            .where('CatID', id)
            .andWhere('Status', 3) // Điều kiện Status = 3
            .andWhere('PublishDate', '<=', currentDate) // Điều kiện PublishDate <= currentDate
            .count('* as total') // Đếm tổng số bản ghi
            .first(); // Lấy kết quả đầu tiên
    },
    findPageByCatId2(id, limit, offset, account) {
        return db('news').where('CatID', id).andWhere('WriterID', account).limit(limit).offset(offset);
    },
    findPageByCatId(id, limit, offset) {
        return db('news').where('CatID', id).limit(limit).offset(offset);
    },
    findPageByCatIdFillGuest(id, limit, offset) {
        const currentDate = new Date();
        return db('news')
            .where('CatID', id)
            .andWhere('Status', 3) // Điều kiện Status = 3
            .andWhere('PublishDate', '<=', currentDate) // Điều kiện PublishDate <= currentDate
            .limit(limit)
            .offset(offset);
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
    findPageByTagIdFilter(tagId, limit, offset) {
        return db('news')
            .join('newstag', 'news.NewsID', 'newstag.NewsID')
            .where('newstag.TagID', tagId)
            .andWhere('news.Status', 3)
            .andWhere('news.PublishDate', '<=', new Date())
            .select('news.*') // Chỉ lấy thông tin từ bảng news
            .orderBy('news.PublishDate', 'desc')
            .limit(limit)
            .offset(offset);
    },
    relatedNews(id) {
        return db('news')
            .where('CatID', function () {
                this.select('CatID').from('news').where('NewsID', id);
            })
            .andWhere('NewsID', '<>', id)
            .orderBy('PublishDate', 'desc')
            .limit(5);
    },
    addNews(entity) {
        return db('news').insert(entity)
    },
    findlast() {
        return db('news')
            .orderBy('NewsID', 'desc') // Sắp xếp giảm dần theo id
            .first() // Lấy dòng đầu tiên từ kết quả

    },
    findTagById(id) {
        return db('newstag').select('TagID').where('NewsID', id)
    },
    findCategoryById(id) {
        return db('news').where('NewsID', id).select('CatID').then(result => result[0]);
    },
    updateNews(id, entity) {
        return db('news').where('NewsID', id).update(entity)
    },
    delTag(id) {
        return db('newstag').where('NewsID', id).del()
    },
    findNewsofWriter(id) {
        return db('news').where('WriterID', id).orderBy('PublishDate', 'desc')
    },
    findCatofWriter(id) {
        return db('news').where('WriterID', id).select('CatID');
    },
    findCountCatNewsofWriter(idCat, idWriter) {
        return db('news') // Chọn bảng 'news'
            .where('CatID', idCat) // Lọc theo Category ID
            .andWhere('WriterID', idWriter) // Lọc theo Writer ID
            .count('* as total').first() // Đếm số lượng bản ghi (NewsID)

    },
    del(id) {
        return db('news').where('NewsID', id).del()
    },
    patch(id, changes) {
        return db('news').where('NewsID', id).update(changes)
    },
    findTagByIdOfNew(id) {
        return db('newstag as t1')
            .join('tag as t2', 't1.TagID', '=', 't2.TagID')
            .select('*')
            .where('t1.NewsID', id)
    },
    findCountAllByAccount(account) {
        return db('news')
            .where('WriterID', account)
            .count({ total: 'NewsID' })
            .first();
    },
    findPageByAccount(account, limit, offset) {
        return db('news')
            .where('WriterID', account)
            .limit(limit)
            .offset(offset);
    },
    searchNews(keyword, limit, offset) {
        const currentDate = new Date().toISOString();

        return db.raw(`
            SELECT 
                *
            FROM 
                news
            WHERE 
                MATCH (Title, Abstract, Content) AGAINST (
                    ? IN NATURAL LANGUAGE MODE
                )
                AND Status = 3
                AND PublishDate <= ?
            LIMIT ? OFFSET ?;
        `, [keyword, currentDate, limit, offset]);
    },
    countBySearch(keyword) {
        const currentDate = new Date().toISOString();

        return db.raw(`
            SELECT 
                COUNT(*) as total
            FROM 
                news
            WHERE 
                MATCH (Title, Abstract, Content) AGAINST (
                    ? IN NATURAL LANGUAGE MODE
                )
                AND Status = 3
                AND PublishDate <= ?;
        `, [keyword, currentDate]);
    },
    findNewsofEditor(accountID, status) {
        return db('news')
            .leftJoin('editorcategory', 'news.CatID', 'editorcategory.CatID')
            .where('editorcategory.AccountID', accountID)
            .andWhere('news.Status', status)
            .select('news.*')
    },
    findCountAllArticles(accountID, status) {
        return db('news')
            .leftJoin('editorcategory', 'news.CatID', 'editorcategory.CatID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('editorcategory.AccountID', accountID)
            .andWhere('news.Status', status)
            .count({ total: 'news.NewsID' })
            .first();
    },
    findCountArticlesByCat(idCat, accountID, status) {
        return db('news') // Chọn bảng 'news'
            .leftJoin('editorcategory', 'news.CatID', 'editorcategory.CatID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('editorcategory.AccountID', accountID)
            .andWhere('news.Status', status)
            .andWhere('news.CatID', idCat) // Lọc theo Category ID
            .count('* as total').first() // Đếm số lượng bản ghi (NewsID)
    },
    findPageForAllArticles(accountID, limit, offset, status) {
        return db('news')
            .leftJoin('editorcategory', 'news.CatID', 'editorcategory.CatID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('editorcategory.AccountID', accountID)
            .andWhere('news.Status', status)
            .limit(limit)
            .offset(offset);
    },
    findPageForArticlesByCat(CatID, limit, offset, accountID, status) {
        return db('news') // Chọn bảng 'news'
            .leftJoin('editorcategory', 'news.CatID', 'editorcategory.CatID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('editorcategory.AccountID', accountID)
            .andWhere('news.Status', status)
            .andWhere('news.CatID', CatID) // Lọc theo Category ID
            .limit(limit)
            .offset(offset);
    },
    findPageForAllRejectedArticles(accountID, limit, offset) {
        return db('news')
            .leftJoin('rejectreason', 'news.NewsID', 'rejectreason.NewsID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('rejectreason.EditorID', accountID)
            .limit(limit)
            .offset(offset);
    },
    findPageForRejectedArticlesByCat(CatID, limit, offset, accountID) {
        return db('news')
            .leftJoin('rejectreason', 'news.NewsID', 'rejectreason.NewsID')
            .leftJoin('account', 'news.WriterID', 'account.Id')
            .where('rejectreason.EditorID', accountID)
            .andWhere('news.CatID', CatID)
            .limit(limit)
            .offset(offset);
    },
    findCountNewsByStatusID(account, status) {
        return db('news')
            .where('WriterID', account)
            .andWhere('Status', status)
            .count({ total: 'NewsID' })
            .first();

    },
    findPageNewsByStatusID(account, limit, offset, status) {
        return db('news')
            .where('Status', status)
            .andWhere('WriterID', account)
            .limit(limit)
            .offset(offset);
    }

}