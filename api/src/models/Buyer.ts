import db from '../database/db';
import { AddBuyerInput, UpdateBuyerInput } from '../graphql/inputs/BuyerInput';
import BuyerType from '../graphql/types/BuyerType';
import Category from './Category';

const getAll = async (): Promise<Array<BuyerType>> => {
  const query = 'FOR buyer IN buyers RETURN buyer';
  const cursor = await db.query(query);
  return cursor.all();
};

const get = async (key: string): Promise<BuyerType> => {
  const cursor = await db.query(`
    FOR buyer IN buyers
    FILTER buyer._key == '${key}'
    LIMIT 1
    RETURN buyer
  `);

  return cursor.next();
};

const getFromCartProduct = async (key: string) => db.inEdges(
  'in_buyer_cart', `products/${key}`,
);

const add = async (newBuyer: AddBuyerInput): Promise<BuyerType> => {
  const newDoc = await db.createDocument('buyers', Object.assign(newBuyer, {
    name: newBuyer.name,
    phone: newBuyer.phone,
    email: newBuyer.email,
    birthday: newBuyer.birthday.toLocaleString(),
    address: newBuyer.address,
    photo: newBuyer.photo,
    banner: newBuyer.banner,
    points: 0,
  }), { returnNew: true });

  // Add product->categories edges
  await Category.updateBuyerCategories(newDoc.new._key, newBuyer.categories);
  return newDoc.new;
};

const remove = async (key: string): Promise<BuyerType> => {
  // Remove edges(buyer->categories, buyer->reviews, buyer->orders) linked to buyer
  await Promise.all([
    db.removeByExample('buyers_categories', '_from', `buyers/${key}`),
    db.removeByExample('reviews', '_from', `buyers/${key}`),
    db.removeByExample('ordered_by', '_to', `products/${key}`),
  ]);

  const oldDoc = await db.removeDocument('buyers', key, { returnOld: true });
  return oldDoc.old;
};

const update = async (updatedBuyer: UpdateBuyerInput): Promise<BuyerType> => {
  // Update buyer->categories edges
  if (updatedBuyer.categories) {
    await Category.updateBuyerCategories(updatedBuyer._key, updatedBuyer.categories, true);
  }

  const oldDoc = await db.getDocument('buyers', updatedBuyer._key);
  const updatedDoc = await db.replaceDocument('buyers', Object.assign(oldDoc, updatedBuyer), { returnNew: true });
  return updatedDoc.new;
};

export = {
  getAll,
  get,
  getFromCartProduct,
  add,
  remove,
  update,
};
