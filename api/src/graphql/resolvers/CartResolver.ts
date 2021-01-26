import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
} from 'type-graphql';
import CartType from '../types/CartType';
import CartModel from '../../models/Cart';
import { CartItem, ReduceCartItem } from '../inputs/CartInput';

@resolver(() => CartType)
export default class CartResolver {
  @query(() => CartType, { nullable: true })
  async getCartByUser(@arg('key') key: string) {
    return CartModel.getCartByUserKey(key);
  }

  @mutation(() => CartType)
  async addItemToCart(@arg('cartItem') cartItem: CartItem) {
    return CartModel.addItemToCart(cartItem);
  }

  @mutation(() => CartType)
  async decreaseItemQuantity(@arg('cartInfo') cartInfo:ReduceCartItem) {
    return CartModel.decreaseItemQuantity(cartInfo);
  }

  @mutation(() => CartType, { nullable: true })
  async removeItemFromCart(@arg('cartInfo') cartInfo:ReduceCartItem) {
    return CartModel.removeItemFromCart(cartInfo);
  }
}
