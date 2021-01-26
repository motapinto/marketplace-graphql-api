import Category from '../../models/Category';
import { AddCategoryInput } from '../../graphql/inputs/CategoryInput';

const addCategories = () => Promise.all([
  Category.add(Object.assign(new AddCategoryInput(), { _key: '1', name: 'honey' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '2', name: 'milk' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '3', name: 'cookies' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '4', name: 'pork' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '5', name: 'jam' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '6', name: 'chicken' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '7', name: 'octupus' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '8', name: 'crabs' })),
  Category.add(Object.assign(new AddCategoryInput(), { _key: '9', name: 'bread' })),
]);

export default addCategories;
