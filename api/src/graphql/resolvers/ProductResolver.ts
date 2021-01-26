import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
  Args as args,
  Root as root,
  FieldResolver as fieldResolver,
} from 'type-graphql';
import ProductType from '../types/ProductType';
import SearchProductArgs from '../args/ProductArgs';
import { AddProductInput, UpdateProductInput } from '../inputs/ProductInput';
import Product from '../../models/Product';
import Producer from '../../models/Producer';
import Review from '../../models/Review';
import Category from '../../models/Category';

@resolver(() => ProductType)
export default class ProductResolver {
  @fieldResolver()
  async categories(@root() product: ProductType) {
    return Category.getFromProduct(product._key);
  }

  @fieldResolver()
  async producer(@root() product: ProductType) {
    return Producer.getFromProduct(product._key);
  }

  @fieldResolver()
  async reviews(@root() product: ProductType) {
    return Review.getFromProduct(product._key);
  }

  @fieldResolver()
  async rating(@root() product: ProductType) {
    const reviews = await Review.getFromProduct(product._key);
    if (!Array.isArray(reviews) || !reviews.length) return null;

    const ratingsSum = reviews.reduce((prev, curr) => prev + (curr.rating || 0), 0);
    return (ratingsSum / reviews.length).toFixed(1);
  }

  @query(() => ProductType)
  async product(@arg('_key') key: string) {
    return Product.get(key);
  }

  @query(() => [ProductType])
  async products(@args() {
    query, categories, priceMin, priceMax, sort,
  } : SearchProductArgs) {
    return Product.getAll(query, categories, priceMin, priceMax, sort);
  }

  @mutation(() => ProductType)
  async addProduct(@arg('product') product: AddProductInput) {
    return Product.add(product);
  }

  @mutation(() => ProductType, { defaultValue: [] })
  async removeProduct(@arg('_key') key: string) {
    return Product.remove(key);
  }

  @mutation(() => ProductType)
  async updateProduct(@arg('product') product: UpdateProductInput) {
    return Product.update(product);
  }
}
