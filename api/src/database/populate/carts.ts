import Buyer from '../../models/Buyer';
import Product from '../../models/Product';
import Cart from '../../models/Cart';
import CartProductInput from '../../graphql/inputs/CartInput';

const addCarts = async () => {
  const buyers = await Buyer.getAll();
  const products = await Product.getAll(undefined, undefined, undefined, undefined, undefined);

  return Promise.all([
    Cart.update(Object.assign(new CartProductInput(), {
      _key: '001',
      productKey: products[0]._key,
      buyerKey: buyers[1]._key,
      quantity: 2,
    })),
    Cart.update(Object.assign(new CartProductInput(), {
      _key: '002',
      productKey: products[4]._key,
      buyerKey: buyers[1]._key,
      quantity: 1,
    })),
    Cart.update(Object.assign(new CartProductInput(), {
      _key: '003',
      productKey: products[6]._key,
      buyerKey: buyers[1]._key,
      quantity: 4,
    })),
    Cart.update(Object.assign(new CartProductInput(), {
      _key: '004',
      productKey: products[1]._key,
      buyerKey: buyers[0]._key,
      quantity: 3,
    })),
    Cart.update(Object.assign(new CartProductInput(), {
      _key: '005',
      productKey: products[5]._key,
      buyerKey: buyers[0]._key,
      quantity: 6,
    })),
  ]);
};

export default addCarts;
