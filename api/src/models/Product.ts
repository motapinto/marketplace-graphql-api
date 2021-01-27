import db from '../database/db';
import { Sort } from '../graphql/types/sortEnum';
import { AddProductInput, UpdateProductInput } from '../graphql/inputs/ProductInput';
import ProductType from '../graphql/types/ProductType';
import Category from './Category';

const getSortQuery = (sort: Sort, search: string = undefined) => {
  let query = search ? 'SORT BM25(product) DESC, ' : 'SORT ';

  switch (sort) {
    case Sort.MOST_RECENT:
      query += 'product.publishedAt DESC';
      return query;

    case Sort.PRICE_HIGH_LOW:
      query += 'product.price DESC';
      return query;

    case Sort.PRICE_LOW_HIGH: default:
      query += 'product.price ASC';
      return query;

    case Sort.RATING:
      return `
        LET rating = AVERAGE(
          FOR review IN reviews
          FILTER review._to == product._id
          RETURN review.rating
        )
      ${query} rating DESC`;
  }
};

const filterQuery = (categories: string[], priceMin: number, priceMax: number) => {
  const queriesArray: string[] = [];
  let query: string = '';

  if (categories && categories.length !== 0) {
    query = `
      LET categories = (
        FOR v IN 1..1 
        OUTBOUND product._id products_categories
        RETURN v.name
      )
    `;

    categories.forEach((category: string) => {
      queriesArray.push(`'${category}' in categories`);
    });

    query += `FILTER (${queriesArray.join(' || ')})`;
  }

  if (priceMin !== undefined && priceMax !== undefined) {
    if (categories && categories.length !== 0) query += ` && product.price >= ${priceMin} && product.price <= ${priceMax}`;
    else query = `FILTER product.price >= ${priceMin} && product.price <= ${priceMax}`;
  }
  return query;
};

const searchAnalizerQuery = (searched: string) => (searched ? ` SEARCH ANALYZER(
  BOOST(product.name IN TOKENS('${searched}', 'text_en'), 5) ||
    product.description IN TOKENS('${searched}', 'text_en'), 'text_en')` : '');

const getAll = async (searched: string, categories: string[], priceMin: number, priceMax: number, sort: Sort)
: Promise<Array<ProductType>> => {
  const search = searchAnalizerQuery(searched);
  const filter = filterQuery(categories, priceMin, priceMax);
  const sorter = getSortQuery(sort, search);

  const cursor = await db.query(`
    FOR product IN products_view 
    ${search}
    ${filter}
    ${sorter} 
    RETURN product
  `);

  return cursor.all();
};

const get = async (key: string): Promise<ProductType> => {
  const cursor = await db.query(`
    FOR product IN products_view
    FILTER product._key == '${key}'
    LIMIT 1
    RETURN product
  `);

  return cursor.next();
};

const add = async (newProduct: AddProductInput): Promise<ProductType> => {
  const newDoc = await db.createDocument('products', Object.assign(newProduct, {
    name: newProduct.name,
    description: newProduct.description,
    price: newProduct.price,
    stock: newProduct.stock,
    images: newProduct.images,
    publishedAt: new Date().toLocaleString(),
    location: newProduct.location,
  }), { returnNew: true });

  // Add product->categories edges
  await Category.updateProductCategories(newDoc.new._key, newProduct.categories);
  // Add producer->product edge
  await db.createDocument('produced_by', { _from: `producers/${newProduct.producer}`, _to: `products/${newDoc.new._key}` });
  return newDoc.new;
};

const remove = async (key: string): Promise<ProductType> => {
  // Remove edges(product->categories, product->reviews, product->producer) linked to product
  await Promise.all([
    db.removeByExample('products_categories', '_from', `products/${key}`),
    db.removeByExample('reviews', '_to', `products/${key}`),
    db.removeByExample('produced_by', '_to', `products/${key}`),
  ]);

  const oldDoc = await db.removeDocument('products', key, { returnOld: true });
  return oldDoc.old;
};

const update = async (updatedProduct: UpdateProductInput): Promise<ProductType> => {
  // Update product->categories edges
  if (updatedProduct.categories) {
    await Category.updateProductCategories(updatedProduct._key, updatedProduct.categories, true);
  }

  const oldDoc = await db.getDocument('products', updatedProduct._key);
  const updatedDoc = await db.replaceDocument('products', Object.assign(oldDoc, updatedProduct), { returnNew: true });
  return updatedDoc.new;
};

export = {
  getAll,
  get,
  add,
  remove,
  update,
};
