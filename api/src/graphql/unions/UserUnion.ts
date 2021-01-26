import { createUnionType } from 'type-graphql';
import ProducerType from '../types/ProducerType';
import BuyerType from '../types/BuyerType';

const UserUnion = createUnionType({
  name: 'UserUnion',
  types: () => [ProducerType, BuyerType] as const,
  resolveType: (value) => {
    if ('points' in value) {
      return BuyerType;
    }
    if ('location' in value) {
      return ProducerType;
    }

    return undefined;
  },
});

export default UserUnion;
