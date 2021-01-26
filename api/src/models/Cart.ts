import { CollectionType } from 'arangojs/collection';
import db from '../database/db';
import { CartItem, ReduceCartItem } from '../graphql/inputs/CartInput';
import { CartProductInput } from '../graphql/inputs/ProductInput';
import ProductInCart from '../graphql/types/ProductInCart';

const userKeyQuery = (userKey:string) => `
  FOR doc IN carts
  FILTER doc.user._key == "${userKey}"
  LIMIT 1
  RETURN doc
`;

const getCartByUserKey = async (userKey: string) => {
  await db.openCollection('carts', CollectionType.DOCUMENT_COLLECTION);
  const query = userKeyQuery(userKey);
  const cursor = await db.query(query);
  const res = await cursor.all();
  return res[0];
};

const addItemLogic = (data:any, product:CartProductInput, quantity:number) => {
  const ret = data;
  const index = ret.list.findIndex((element: ProductInCart) => element.product._key === product._key);
  if (index !== -1) ret.list[index].quantity += quantity;
  else ret.list.push({ product, quantity });
  return ret;
};

const addItemToCart = async ({
  userKey, product, quantity,
} : CartItem) => {
  await db.openCollection('carts', CollectionType.DOCUMENT_COLLECTION);
  const data = await getCartByUserKey(userKey);
  const newData = addItemLogic(data, product, quantity);
  const updatedProduct = await db.replaceDocument('carts', newData, { returnNew: true });
  return updatedProduct.new;
};

const decreaseItemQLogic = (data:any, product:String) => {
  const ret = data;
  const index = ret.list.findIndex((element: ProductInCart) => element.product._key === product);
  if (index !== -1) {
    ret.list[index].quantity -= 1;
    ret.list = ret.list.filter((element: ProductInCart) => element.quantity > 0);
  }

  return ret;
};

const decreaseItemQuantity = async ({
  userKey, product,
} : ReduceCartItem) => {
  await db.openCollection('carts', CollectionType.DOCUMENT_COLLECTION);
  const data = await getCartByUserKey(userKey);
  const newData = decreaseItemQLogic(data, product);
  const updatedProduct = await db.replaceDocument('carts', newData, { returnNew: true });
  return updatedProduct.new;
};

const removeItemFromCart = async ({
  userKey, product,
} : ReduceCartItem) => {
  await db.openCollection('carts', CollectionType.DOCUMENT_COLLECTION);
  const data = await getCartByUserKey(userKey);
  data.list = data.list.filter((item:ProductInCart) => item.product._key !== product);
  const updatedProduct = await db.replaceDocument('carts', data, { returnNew: true });
  return updatedProduct.new;
};

export = {
  userKeyQuery,
  getCartByUserKey,
  addItemLogic,
  addItemToCart,
  decreaseItemQLogic,
  decreaseItemQuantity,
  removeItemFromCart,
};
