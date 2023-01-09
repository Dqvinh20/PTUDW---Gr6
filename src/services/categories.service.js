import db from "../utils/db.js";

const getAllCategories = async () => {
    const parent_cat = await db('categories').select(["cat_id", "cat_name", "slug"]).whereNull('parent_cat_id');
    const categories = await Promise.all(parent_cat.map(async (cat) => {
        cat.children = await db('categories')
            .select(["cat_id", "cat_name", "slug"])
            .where('parent_cat_id', cat.cat_id);
        return cat;
    }));
    return categories;
}

export default {
    getAllCategories,
}