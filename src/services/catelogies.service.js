import db from '../utils/db.js';

export default {
  findAll() {
    // return [
    //   { CatID: 1, CatName: 'Laptop' },
    //   { CatID: 2, CatName: 'Mobile' },
    //   { CatID: 3, CatName: 'Quần áo' },
    //   { CatID: 4, CatName: 'Giày dép' },
    //   { CatID: 5, CatName: 'Trang sức' },
    //   { CatID: 6, CatName: 'Khác' },
    // ];
    return db('CatelogiesFinal');
  },

  async findById(id) {
    const list = await db('Cat').where('CatID', id);
    if (list.length === 0) {
      return null;
    }

    return list[0];
  },
  findAllWithDetails(){
    const sql =`select c.*, cast(count(p."ProID") as INTEGER) as "ProductCount"
    from "Cat" c left join "products" p on c."CatID" = p."CatID"
    group by c."CatID", c."CatName"`;
    return db.raw(sql);
  },

  add(entity) {
    return db('Cat').insert(entity);
  },

  del(id) {
    return db('Cat').where('CatID', id).del();
  },

  patch(entity) {
    const id = entity.CatID;
    delete entity.CatID;
    return db('Cat').where('CatID', id).update(entity);
  }
}