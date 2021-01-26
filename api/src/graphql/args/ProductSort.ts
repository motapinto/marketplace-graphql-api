import 'reflect-metadata';
import {
  ObjectType as objectType,
  Field as field,
  Query as query,
  Resolver as resolver,
} from 'type-graphql';
import database from '../../database/db';

export const getSorts = async () => {
  const cursor = await database.query(`
    FOR sortElem IN sorts 
    RETURN sortElem
  `);

  return cursor.all();
};

@objectType()
class SortType {
  @field()
  name: string;
}

@resolver(() => SortType)
export default class SortResolver {
  @query(() => [SortType])
  async sorts() {
    return getSorts();
  }
}
