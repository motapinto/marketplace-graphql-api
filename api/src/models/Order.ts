import db from '../database/db';
import AddOrderInput from '../graphql/inputs/OrderInput';
import OrderType from '../graphql/types/OrderType';
import ProductType from '../graphql/types/ProductType';
import Product from './Product';

interface ArangoOrder {
  _key: string
  _from: string
  _to: string
  quantity: number
  date: string
}

interface ArangoGetOrder {
  v: ProductType
  e: {
    _key: string
    _id: string
    _rev: string
    _from: string
    _to: string
    quantity: number
    date: string
  }
}

const getFromBuyer = async (key: string): Promise<Array<Partial<OrderType>>> => {
  const orderedProducts: ArangoGetOrder[] = await db.outEdges2('product_order', `buyers/${key}`);

  return orderedProducts.map((product) => ({
    _key: product.e._key,
    product: product.v,
    quantity: product.e.quantity,
    date: product.e.date,
  }));
};

const getProduct = async (orderKey: string): Promise<ProductType> => {
  const order: ArangoOrder = await db.getDocument('product_order', orderKey);
  return Product.get(order._to.substring('products/'.length));
};

const parseArangoOrder = async (arangoOrder: ArangoOrder): Promise<OrderType> => Object.assign(new OrderType(), {
  _key: arangoOrder._key,
  quantity: arangoOrder.quantity,
  date: arangoOrder.date,
});

const add = async (newOrder: AddOrderInput): Promise<OrderType> => {
  const newDoc = await db.createDocument('product_order', Object.assign(newOrder, {
    _from: `buyers/${newOrder.buyerKey}`,
    _to: `products/${newOrder.productKey}`,
    date: new Date().toLocaleString(),
    quantity: newOrder.quantity,
  }), { returnNew: true });

  return parseArangoOrder(newDoc.new);
};

const remove = async (key: string): Promise<OrderType> => {
  const oldDoc = await db.removeDocument('product_order', key, { returnOld: true });
  return oldDoc.old;
};

export = {
  getFromBuyer,
  getProduct,
  add,
  remove,
};
