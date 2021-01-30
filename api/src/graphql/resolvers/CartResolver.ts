import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
  FieldResolver as fieldResolver,
  Root as root,
} from 'type-graphql';
import CartType from '../types/CartType';
import Cart from '../../models/Cart';
import CartProductInput from '../inputs/CartInput';

@resolver(() => CartType)
export default class CartResolver {
  @fieldResolver()
  async price(@root() cart: CartType) {
    return cart.list.reduce((prev, cur) => prev + (cur.product.price * cur.quantity), 0);
  }

  @mutation(() => CartType, { nullable: true })
  async updateCart(@arg('cart') cart: CartProductInput) {
    return Cart.update(cart);
  }
}
