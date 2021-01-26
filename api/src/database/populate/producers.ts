import Producer from '../../models/Producer';
import { AddProducerInput } from '../../graphql/inputs/ProducerInput';

const addProducers = async () => {
  const stockPhoto = { dataLocation: 'assets/stock.jpeg' };
  const dublinLoc = { latitude: 53.347229, longitude: -6.266593 };

  return Promise.all([
    Producer.add(Object.assign(new AddProducerInput(), {
      _key: '1',
      description: 'I am a young farmer that uses new and improved tecnhiques, that will make all of my products better',
      name: 'Sophie Austin',
      photo: stockPhoto,
      banner: stockPhoto,
      location: dublinLoc,
      phone: '+351919191911',
      email: 'sophie@austin.com',
      birthday: '01-01-1999',
      address: 'Rua Exemplo, nº 1002',
    })),
    Producer.add(Object.assign(new AddProducerInput(), {
      _key: '2',
      description: 'We are a couple living in Cork, trying to help make the world a more sustainable place. We sell the fruits we grow in our home, both in their natural forms and as delicious homemade jam. We hope you enjoy our products!',
      name: 'Austin\'s',
      photo: stockPhoto,
      banner: stockPhoto,
      location: dublinLoc,
      phone: '+351919191912',
      email: 'austins@gmail.com',
      birthday: '21-05-1978',
      address: 'Rua Exemplo, nº 1003',
    })),
    Producer.add(Object.assign(new AddProducerInput(), {
      _key: '3',
      description: 'Old but experienced farmer, that will look to work very hard to make his products fresh, delicious, and clean.',
      name: 'Arlo David',
      photo: stockPhoto,
      banner: stockPhoto,
      location: dublinLoc,
      phone: '+351919191913',
      email: 'arlo@david.com',
      birthday: '02-12-1965',
      address: 'Rua Exemplo, nº 1004',
    })),
  ]);
};

export default addProducers;
