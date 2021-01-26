import Buyer from '../../models/Buyer';
import Category from '../../models/Category';
import { AddBuyerInput } from '../../graphql/inputs/BuyerInput';

const addBuyers = async () => {
  const stockPhoto = { dataLocation: 'assets/honey.jpeg' };
  const honey = await Category.get('1');
  const milk = await Category.get('2');
  const cookies = await Category.get('3');

  return Promise.all([
    Buyer.add(Object.assign(new AddBuyerInput(), {
      _key: '1',
      name: 'Martim Pinto da Silva',
      phone: '+351919191919',
      photo: stockPhoto,
      banner: stockPhoto,
      email: 'email@example.com',
      birthday: '01-01-1999',
      address: 'Rua Exemplo, nº 1000',
      categories: [honey, cookies],
    })),

    Buyer.add(Object.assign(new AddBuyerInput(), {
      _key: '2',
      name: 'John Travis',
      phone: '+351919191918',
      photo: stockPhoto,
      banner: stockPhoto,
      email: 'john@travis.com',
      birthday: '01-01-1957',
      address: 'Rua Exemplo, nº 1001',
      categories: [milk, cookies],
    })),
  ]);
};

export default addBuyers;
