import db from '../database/db';
import { AddProducerInput, UpdateProducerInput } from '../graphql/inputs/ProducerInput';
import ProducerType from '../graphql/types/ProducerType';
import ProductType from '../graphql/types/ProductType';
import Product from './Product';

const getAll = async (): Promise<Array<ProducerType>> => {
  const query = 'FOR producer IN producers RETURN producer';
  const cursor = await db.query(query);
  return cursor.all();
};

const get = async (key: string): Promise<ProducerType> => {
  const cursor = await db.query(`
    FOR producer IN producers
    FILTER producer._key == '${key}'
    LIMIT 1
    RETURN producer
  `);

  return cursor.next();
};

const getFromProduct = async (productKey: string)
: Promise<ProductType> => db.inEdges(`products/${productKey}`, 'producers');

const getProducts = async (producerKey: string)
: Promise<Array<ProductType>> => db.outEdges('produced_by', `producers/${producerKey}`);

const add = async (newProducer: AddProducerInput) : Promise<ProducerType> => {
  const newDoc = await db.createDocument('producers', Object.assign(newProducer, {
    name: newProducer.name,
    phone: newProducer.phone,
    email: newProducer.email,
    birthday: newProducer.birthday.toLocaleString(),
    address: newProducer.address,
    photo: newProducer.photo,
    banner: newProducer.banner,
    description: newProducer.description,
    location: newProducer.location,
  }), { returnNew: true });

  return newDoc.new;
};

const remove = async (key: string): Promise<ProducerType> => {
  // Remove edges(producer->product) linked to producer
  const products = await getProducts(key);
  products.forEach((product: ProductType) => {
    Product.remove(product._key);
  });

  const oldDoc = await db.removeDocument('producers', key, { returnOld: true });
  return oldDoc.old;
};

const update = async (updatedProducer: UpdateProducerInput): Promise<ProducerType> => {
  const oldProducer = await db.getDocument('producers', updatedProducer._key);
  const updatedDoc = await db.replaceDocument('producers', Object.assign(oldProducer, updatedProducer), { returnNew: true });
  return updatedDoc.new;
};

export = {
  getAll,
  get,
  getFromProduct,
  getProducts,
  add,
  remove,
  update,
};
