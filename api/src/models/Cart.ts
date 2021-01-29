import db from '../database/db';
import CartProductInput from '../graphql/inputs/CartInput';
import CartType from '../graphql/types/CartType';
import ProductType from '../graphql/types/ProductType';

interface ArangoGetBuyerCart {
  v: ProductType,
  e: {
    _key: string,
    _id: string,
    _rev: string,
    _from: string,
    _to: string,
    quantity: number
  }
}

const getFromBuyer = async (key: string): Promise<CartType> => {
  const cartProducts: ArangoGetBuyerCart[] = await db.outEdges2('in_buyer_cart', `buyers/${key}`);

  return Object.assign(new CartType(), {
    list: cartProducts.map((cartProduct) => ({
      _key: cartProduct.e._key,
      product: cartProduct.v,
      quantity: cartProduct.e.quantity,
    })),
  });
};

const update = async (cartProduct: CartProductInput): Promise<CartType> => {
  if (cartProduct.quantity === 0 && cartProduct._key) {
    const cart = await getFromBuyer(cartProduct.buyerKey);
    if (cart.list.find((productCard) => productCard.product._key === cartProduct.productKey) !== undefined) {
      await db.removeDocument('in_buyer_cart', cartProduct._key);
    }
  } else if (!cartProduct._key) {
    await db.createDocument('in_buyer_cart', {
      _from: `buyers/${cartProduct.buyerKey}`,
      _to: `products/${cartProduct.productKey}`,
      quantity: cartProduct.quantity,
    });
  } else if (cartProduct._key && cartProduct.quantity > 0) {
    await db.replaceDocument('in_buyer_cart', {
      _key: cartProduct._key,
      _from: `buyers/${cartProduct.buyerKey}`,
      _to: `products/${cartProduct.productKey}`,
      quantity: cartProduct.quantity,
    });
  }

  return getFromBuyer(cartProduct.buyerKey);
};

export = {
  getFromBuyer,
  update,
};
