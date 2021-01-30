import Buyer from '../../models/Buyer';
import Product from '../../models/Product';
import Order from '../../models/Order';
import AddOrderInput from '../../graphql/inputs/OrderInput';

const addOrders = async () => {
  const buyers = await Buyer.getAll();
  const products = await Product.getAll(undefined, undefined, undefined, undefined, undefined);

  return Promise.all([
    Order.add(Object.assign(new AddOrderInput(), {
      _key: '001',
      productKey: products[0]._key,
      buyerKey: buyers[1]._key,
      quantity: 2,
    })),
    Order.add(Object.assign(new AddOrderInput(), {
      _key: '002',
      productKey: products[1]._key,
      buyerKey: buyers[0]._key,
      quantity: 12,
    })),
    Order.add(Object.assign(new AddOrderInput(), {
      _key: '003',
      productKey: products[4]._key,
      buyerKey: buyers[0]._key,
      quantity: 7,
    })),
    Order.add(Object.assign(new AddOrderInput(), {
      _key: '004',
      productKey: products[6]._key,
      buyerKey: buyers[1]._key,
      quantity: 4,
    })),
    Order.add(Object.assign(new AddOrderInput(), {
      _key: '005',
      productKey: products[5]._key,
      buyerKey: buyers[0]._key,
      quantity: 5,
    })),
  ]);
};

export default addOrders;
