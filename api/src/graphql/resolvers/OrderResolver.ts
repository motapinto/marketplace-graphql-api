import 'reflect-metadata';
import {
  Arg as arg, Query as query, Resolver as resolver, FieldResolver as fieldResolver, Root as root,
} from 'type-graphql';
import Order from '../../models/Order';
import OrderType from '../types/OrderType';

@resolver(() => OrderType)
export default class OrderResolver {
  constructor(
    private readonly orderModel = Order,
  ) { }

  @query(() => OrderType)
  async order(@arg('key') key: string) {
    return this.orderModel.getByKey(key);
  }

  @fieldResolver()
  async product(@root() order: OrderType) {
    return this.orderModel.getProduct(order._key);
  }
}
