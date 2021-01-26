import db from '../database/db';
import OrderInput from '../graphql/inputs/OrderInput';
import OrderType from '../graphql/types/OrderType';

const add = async (orderInput: OrderInput, key: string = null) => {
  const order = Object.assign(orderInput, {
    price: orderInput.price,
    units: orderInput.units,
    date: orderInput.date,
    eta: orderInput.eta,
    inProgress: orderInput.inProgress,
  });

  if (key) Object.assign(order, { _key: key });
  const orderModel = await db.createDocument('orders', order);
  await db.createDocument('ordered_by', { _key: `ordered_by-${orderModel._key}-${orderInput.buyerKey}`, _from: `orders/${orderModel._key}`, _to: `buyer/${orderInput.buyerKey}` });
  await db.createDocument('ordered_product', { _key: `ordered_product-${orderModel._key}-${orderInput.buyerKey}`, _from: `orders/${orderModel._key}`, _to: `products/${orderInput.productKey}` });
};

const getFromBuyer = async (id: string) => {
  const ordersCursor = await db.query(`
        FOR orders IN 1..1 INBOUND "buyer/${id}" ordered_by
        RETURN orders
    `);

  return ordersCursor.all();
};

const getProduct = async (id: string) => {
  const cursor = await db.query(`
        FOR product IN 1..1 OUTBOUND "orders/${id}" ordered_product
        LIMIT 1
        RETURN product
    `);

  return cursor.next();
};

const getProducts = async (id: string) => {
  const cursor = await db.query(`
        FOR product IN 1..1 OUTBOUND "orders/${id}" ordered_product
        RETURN product
    `);

  return cursor.all();
};

const getByKey = async (id: string): Promise<OrderType> => {
  const cursor = await db.query(`
        FOR doc IN orders
        FILTER doc._key == '${id}'
        LIMIT 1
        RETURN doc
      `);

  return cursor.next();
};

export = {
  getByKey,
  add,
  getFromBuyer,
  getProduct,
  getProducts,
};
