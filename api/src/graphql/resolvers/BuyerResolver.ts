import 'reflect-metadata';
import {
  Arg as arg,
  Query as query,
  Mutation as mutation,
  Resolver as resolver,
  FieldResolver as fieldResolver,
  Root as root,
} from 'type-graphql';
import UserResolver from './UserResolver';
import BuyerType from '../types/BuyerType';
import Buyer from '../../models/Buyer';
import Order from '../../models/Order';
import Review from '../../models/Review';
import Category from '../../models/Category';
import { AddBuyerInput, UpdateBuyerInput } from '../inputs/BuyerInput';

@resolver(() => BuyerType)
export default class BuyerResolver extends UserResolver {
  @fieldResolver()
  async categories(@root() buyer: BuyerType) {
    return Category.getFromBuyer(buyer._key);
  }

  @fieldResolver()
  async reviews(@root() buyer: BuyerType) {
    return Review.getFromBuyer(buyer._key);
  }

  @fieldResolver()
  async orders(@root() buyer: BuyerType) {
    return Order.getFromBuyer(buyer._key);
  }

  @query(() => [BuyerType], { nullable: true })
  async buyers() {
    return Buyer.getAll();
  }

  @query(() => BuyerType)
  async buyer(@arg('key') key: string) {
    return Buyer.get(key);
  }

  @mutation(() => BuyerType, { defaultValue: [] })
  async addBuyer(@arg('buyer') buyer: AddBuyerInput) {
    return Buyer.add(buyer);
  }

  @mutation(() => BuyerType, { defaultValue: [] })
  async removeBuyer(@arg('key') key: string) {
    return Buyer.remove(key);
  }

  @mutation(() => BuyerType, { nullable: true })
  async updateBuyer(@arg('buyer') buyer: UpdateBuyerInput) {
    return Buyer.update(buyer);
  }
}