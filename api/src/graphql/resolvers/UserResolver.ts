import 'reflect-metadata';
import {
  Resolver as resolver, Arg as arg, Query as query,
} from 'type-graphql';
import Buyer from '../../models/Buyer';
import Producer from '../../models/Producer';
import UserType from '../types/UserType';
import UserUnion from '../unions/UserUnion';

@resolver()
export default class UserResolver {
  @query(() => [UserUnion], { nullable: true })
  async users(): Promise<Array<typeof UserUnion>> {
    const buyers = await Buyer.getAll();
    const producers = await Producer.getAll();
    return [...buyers, ...producers];
  }

  @query(() => UserType, { nullable: true })
  async user(@arg('key') key: string): Promise<typeof UserUnion> {
    const buyer = await Buyer.get(key);
    const producer = await Producer.get(key);
    return buyer || producer;
  }
}
