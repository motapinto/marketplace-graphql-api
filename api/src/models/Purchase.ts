import { CollectionType } from 'arangojs/collection';
import db from '../database/db';
import { PurchasesInput } from '../graphql/inputs/PurchasesInput';
import Order from './Order';
import { PurchaseState } from '../graphql/types/PurchasesType';

const generateReference = () => Math.random().toString().slice(2, 11);

async function getEntity() {
  const cursor = await db.query(`
    FOR entity in entity
    RETURN entity
  `);
  return cursor.next();
}

const purchase = async (purchaseInput: PurchasesInput, key: string = null) => {
  const products = await Order.getProducts(purchaseInput.orderKey);
  const { _key: entityKey, entity } = await getEntity();

  const purchase = Object.assign(purchaseInput, {
    buyer: purchaseInput.buyerKey,
    status: PurchaseState.ORDERED,
    reference: generateReference(),
  });

  if (key) Object.assign(purchase, { _key: key });

  const purchaseModel = await db.createDocument('purchases', purchase, { returnNew: true });

  await Promise.all(products.map(async (product: any) => {
    await db.createDocument('bought', { _from: `purchases/${purchaseModel._key}`, _to: `products/${product._key}` });
  }));

  await db.createDocument('referencedBy', { _from: `purchases/${purchaseModel._key}`, _to: `entity/${entityKey}` });

  await db.createDocument('buys', { _from: `users/${purchaseInput.buyerKey}`, _to: `purchases/${purchaseModel._key}` });

  return { ...purchase, entity };
};

const confirmPurchase = async (key: string) => {
  const data = await db.getDocument('purchases', key);
  await db.openCollection('purchases', CollectionType.DOCUMENT_COLLECTION);
  const document = await db.replaceDocument('purchases', { ...data, status: PurchaseState.PAID }, { returnNew: true });
  const { entity } = await getEntity();
  return { ...document.new, entity };
};

const getAllPurchases = async (user: string) => {
  const cursor = await db.query(`
    FOR purchase IN 1..1 OUTBOUND "users/${user}" buys 
    RETURN purchase
  `);

  const purchases = await cursor.all();

  const products = await Promise.all(purchases.map(async (purchase) => {
    const cursor = await db.query(`
      FOR product IN 1..1 OUTBOUND "purchases/${purchase._key}" bought 
      RETURN product
    `);

    return cursor.all();
  }));

  return products.flat();
};

export default {
  purchase,
  confirmPurchase,
  getAllPurchases,
};
