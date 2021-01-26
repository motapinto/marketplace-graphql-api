import 'reflect-metadata';
import {
  Resolver as resolver,
  Arg as arg,
  Query as query,
  Mutation as mutation,
} from 'type-graphql';
import Category from '../../models/Category';
import CategoryType from '../types/CategoryType';
import { AddCategoryInput, UpdateCategoryInput } from '../inputs/CategoryInput';

@resolver(() => CategoryType)
export default class CategoryResolver {
  constructor(private readonly categoryModel = Category) {}

  @query(() => CategoryType)
  async category(@arg('_key') key: string) {
    return this.categoryModel.get(key);
  }

  @query(() => [CategoryType])
  async categories() {
    return this.categoryModel.getAll();
  }

  @mutation(() => CategoryType)
  async addCategory(@arg('category') category: AddCategoryInput) {
    return this.categoryModel.add(category);
  }

  @mutation(() => CategoryType)
  async removeCategory(@arg('_key') key: string) {
    return this.categoryModel.remove(key);
  }

  @mutation(() => CategoryType)
  async updateCategory(@arg('category') category: UpdateCategoryInput) {
    return this.categoryModel.update(category);
  }
}
