import Product from '../../models/Product';
import Category from '../../models/Category';
import Producer from '../../models/Producer';
import { AddProductInput } from '../../graphql/inputs/ProductInput';

const addProducts = async () => {
  const stockPhoto = { dataLocation: 'assets/stock.jpeg' };
  const location = { latitude: 53.347229, longitude: -6.266593 };
  const honey = await Category.get('1');
  const milk = await Category.get('2');
  const cookie = await Category.get('3');
  const pork = await Category.get('4');
  const jam = await Category.get('5');
  const chicken = await Category.get('6');
  const octupus = await Category.get('7');
  const crabs = await Category.get('8');
  const bread = await Category.get('9');
  const producers = await Producer.getAll();

  return Promise.all([
    Product.add(Object.assign(new AddProductInput(), {
      _key: '111',
      name: 'Honey',
      description: 'Organic and fresh honey without any artificial substance',
      price: 2.5,
      stock: 10,
      publishedAt: new Date('2019-04-12 07:22:13').toLocaleString(),
      categories: [honey],
      images: [stockPhoto],
      producer: producers[0]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '112',
      name: 'Milk + Cookies',
      description: 'Clean and fresh milk with cookies',
      price: 4.5,
      stock: 15,
      publishedAt: new Date('2018-07-22 07:22:13').toLocaleString(),
      categories: [cookie, milk],
      images: [stockPhoto],
      producer: producers[0]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '113',
      name: 'Jam',
      description: 'Jams craft the old-fashioned way, by hand and using only natural ingredients',
      price: 6.5,
      stock: 5,
      publishedAt: new Date('2012-01-12 07:57:12').toLocaleString(),
      categories: [jam],
      images: [stockPhoto],
      producer: producers[0]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '114',
      name: 'Pork',
      description: 'Fresh pork with the perfect cuts that make your meal delicious and irresistible',
      price: 10.5,
      stock: 12,
      publishedAt: new Date('2013-01-12 07:57:12').toLocaleString(),
      categories: [pork],
      images: [stockPhoto],
      producer: producers[1]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '115',
      name: 'Chicken',
      description: 'Best chicken from the town',
      price: 3.5,
      stock: 8,
      publishedAt: new Date('2016-02-25 07:57:12').toLocaleString(),
      categories: [chicken],
      images: [stockPhoto],
      producer: producers[1]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '116',
      name: 'Octupus',
      description: 'Real octupus, like you\'ve never tried!!',
      price: 12.5,
      stock: 8,
      publishedAt: new Date('2019-01-12 09:57:12').toLocaleString(),
      categories: [octupus],
      images: [stockPhoto],
      producer: producers[1]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '117',
      name: 'Crabs',
      description: 'Best seafood service in the world!',
      price: 14.5,
      stock: 7,
      publishedAt: new Date('2020-01-02 07:57:12').toLocaleString(),
      categories: [crabs],
      images: [stockPhoto],
      producer: producers[1]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '118',
      name: 'Bread',
      description: 'Really fresh and fluffy bread',
      price: 5.0,
      stock: 21,
      publishedAt: new Date('2018-01-12 07:57:12').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '119',
      name: 'Baguette',
      description: 'The best long, stick-like loaf, also called French bread',
      price: 7.20,
      stock: 21,
      publishedAt: new Date('2019-11-27 15:57:12').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '120',
      name: 'Breadstick',
      description: 'Really fresh and crunchy pencil-thin dry bread',
      price: 5.0,
      stock: 41,
      publishedAt: new Date('2018-05-12 12:57:12').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '121',
      name: 'Focaccia',
      description: 'A flat, dimpled yeast bread resembling pizza dough that\'s baked at high temperatures in sheet pans',
      price: 4.20,
      stock: 14,
      publishedAt: new Date('2019-01-12 07:47:12').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '122',
      name: 'Pita Bread',
      description: 'Like tortillas and naan, pita is a flatbread. Soft and round, this slightly leavened bread',
      price: 4.20,
      stock: 17,
      publishedAt: new Date('2019-04-27 18:57:12').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),

    Product.add(Object.assign(new AddProductInput(), {
      _key: '123',
      name: 'Multigrain Bread',
      description: 'If you’re looking for dense, hearty multigrain, which is terrific for sandwiches this bread type is for you',
      price: 4.20,
      stock: 24,
      publishedAt: new Date('2017-05-11 16:12:48').toLocaleString(),
      categories: [bread],
      images: [stockPhoto],
      producer: producers[2]._key,
      location,
    })),
  ]);
};

export default addProducts;
