import 'reflect-metadata';
import database from '../database/db';
import ReviewType from '../graphql/types/ReviewType';
import { AddReviewInput, UpdateReviewInput } from '../graphql/inputs/ReviewInput';

interface ArangoReview {
  _key: string
  _from: string
  _to: string
  title: string
  comment: string
  rating: number
  date: string
}

const parseArangoReview = (val: ArangoReview) : ReviewType => ({
  _key: val._key,
  buyerKey: val._from.substring('buyer/'.length),
  productKey: val._to.substring('product/'.length),
  title: val.title,
  comment: val.comment,
  rating: val.rating,
  date: new Date(Date.parse(val.date)),
});

const parseApolloReview = (val: AddReviewInput) : Partial<ArangoReview> => ({
  _from: `buyer/${val.buyerKey}`,
  _to: `product/${val.productKey}`,
  title: val.title,
  comment: val.comment,
  rating: val.rating,
  date: new Date().toLocaleString(),
});

const getAll = async () => {
  const cursor = await database.query(`
    FOR r IN reviews 
    RETURN r
  `);

  return cursor.map((val: ArangoReview) => parseArangoReview(val));
};

const get = async (key: string) => {
  const cursor = await database.query(`
    FOR r IN reviews 
    FILTER r._key == '${key}' 
    RETURN r
  `);

  return parseArangoReview(await cursor.next());
};

const getFromBuyer = async (key: string) => {
  const cursor = await database.query(`
    FOR r IN reviews
    FILTER r._from == "buyer/${key}"
    RETURN r
  `);

  return cursor.map((val: ArangoReview) => parseArangoReview(val));
};

const getFromProduct = async (key: string) => {
  const cursor = await database.query(`
    FOR r IN reviews
    FILTER r._to == "product/${key}"
    RETURN r
  `);

  return cursor.map((val: ArangoReview) => parseArangoReview(val));
};

const add = async (review: AddReviewInput) => {
  const newDoc = await database.createDocument('reviews', parseApolloReview(review), { returnNew: true });
  return parseArangoReview(newDoc.new);
};

const remove = async (key: string) => {
  const removedDoc = await database.removeDocument('reviews', key, { returnOld: true });
  return parseArangoReview(removedDoc.old);
};

const update = async (updated: UpdateReviewInput) => {
  const old = await database.getDocument('reviews', updated._key);
  const updatedDoc = await database.replaceDocument('reviews', Object.assign(old, updated), { returnNew: true });
  return parseArangoReview(updatedDoc.new);
};

export = {
  getAll,
  get,
  getFromBuyer,
  getFromProduct,
  add,
  remove,
  update,
};
