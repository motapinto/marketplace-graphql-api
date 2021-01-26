import db from '../database/db';
import CategoryType from '../graphql/types/CategoryType';
import { AddCategoryInput, UpdateCategoryInput } from '../graphql/inputs/CategoryInput';

const productCategoriesEdge = 'products_categories';
const buyerCategoriesEdge = 'buyers_categories';

const getAll = async (): Promise<CategoryType[]> => {
  const query = 'FOR category IN categories RETURN category';
  const cursor = await db.query(query);
  return cursor.all();
};

const get = async (key: string): Promise<CategoryType> => {
  const cursor = await db.query(`
    FOR c IN categories
    FILTER c._key == '${key}'
    LIMIT 1
    RETURN c
  `);

  return cursor.next();
};

const getFromProduct = async (key: string): Promise<CategoryType[]> => db.outEdges(
  productCategoriesEdge, `products/${key}`,
);

const getFromBuyer = async (key: string): Promise<CategoryType[]> => db.outEdges(
  buyerCategoriesEdge, `buyers/${key}`,
);

const add = async (category: AddCategoryInput): Promise<CategoryType> => {
  const newDoc = await db.createDocument('categories', category, { returnNew: true });
  return newDoc.new;
};

const remove = async (key: string): Promise<CategoryType> => {
  // Remove categories edges (product->category, buyer->category)
  await Promise.all([
    db.removeByExample(productCategoriesEdge, '_to', `categories/${key}`),
    db.removeByExample(buyerCategoriesEdge, '_to', `categories/${key}`),
  ]);

  const removedDoc = await db.removeDocument('categories', key, { returnOld: true });
  return removedDoc.old;
};

const update = async (updatedCategory: UpdateCategoryInput): Promise<CategoryType> => {
  const oldDoc = await db.getDocument('categories', updatedCategory._key);
  const updatedDoc = await db.replaceDocument('categories', Object.assign(oldDoc, updatedCategory), { returnNew: true });
  return updatedDoc.new;
};

const updateProductCategories = async (productKey: string, categories: CategoryType[], replace: boolean = false) => {
  if (replace) {
    await db.removeByExample('products_categories', '_from', `products/${productKey}`);
  }

  return Promise.all(
    categories.map(async (category: CategoryType) => {
      const updatedDoc = {
        _from: `products/${productKey}`,
        _to: `categories/${category._key}`,
      };

      await db.createDocument(productCategoriesEdge, updatedDoc);
    }),
  );
};

const updateBuyerCategories = async (buyerKey: string, categories: CategoryType[], replace: boolean = false) => {
  if (replace) {
    await db.removeByExample('buyers_categories', '_from', `buyers/${buyerKey}`);
  }

  return Promise.all(
    categories.map(async (category: CategoryType) => {
      const updatedDoc = {
        _from: `buyers/${buyerKey}`,
        _to: `categories/${category._key}`,
      };

      await db.replaceDocument(buyerCategoriesEdge, updatedDoc);
    }),
  );
};

export = {
  getAll,
  get,
  getFromProduct,
  getFromBuyer,
  add,
  remove,
  update,
  updateProductCategories,
  updateBuyerCategories,
};
