import 'reflect-metadata';
import {
  Resolver as resolver, Mutation as mutation, Arg as arg, Query as query,
} from 'type-graphql';
import PurchasesType from '../types/PurchasesType';
import Purchases from '../../models/Purchase';
import { PurchasesInput } from '../inputs/PurchasesInput';
import ProductType from '../types/ProductType';

@resolver(() => PurchasesType)
export default class PurchasesResolver {
  constructor(
    private readonly purchasesModel = Purchases,
  ) { }

  @mutation(() => PurchasesType)
  async purchase(@arg('order') order: PurchasesInput) {
    return this.purchasesModel.purchase(order);
  }

  @mutation(() => PurchasesType)
  async confirmPurchase(@arg('purchase') purchase: string) {
    return this.purchasesModel.confirmPurchase(purchase);
  }

  @query(() => [ProductType])
  async purchases(@arg('user') user: string) {
    return this.purchasesModel.getAllPurchases(user);
  }
}
