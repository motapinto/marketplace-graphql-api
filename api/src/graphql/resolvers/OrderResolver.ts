import 'reflect-metadata';
import {
  Arg as arg, Mutation as mutation, Resolver as resolver, FieldResolver as fieldResolver, Root as root,
} from 'type-graphql';
import Order from '../../models/Order';
import OrderType from '../types/OrderType';
import AddOrderInput from '../inputs/OrderInput';

@resolver(() => OrderType)
export default class OrderResolver {
  @fieldResolver()
  async product(@root() order: OrderType) {
    return Order.getProduct(order._key);
  }

  @fieldResolver()
  async price(@root() order: OrderType) {
    const product = await Order.getProduct(order._key);
    return product.price * order.quantity;
  }

  @mutation(() => OrderType, { nullable: true })
  async addOrder(@arg('order') order: AddOrderInput) {
    return Order.add(order);
  }

  @mutation(() => OrderType, { nullable: true })
  async removeOrder(@arg('key') key: string) {
    return Order.remove(key);
  }
}
