import 'reflect-metadata';
import {
  Arg as arg,
  Query as query,
  Mutation as mutation,
  Resolver as resolver,
  FieldResolver as fieldResolver,
  Root as root,
} from 'type-graphql';
import UserResolver from './UserResolver';
import ProducerType from '../types/ProducerType';
import Producer from '../../models/Producer';
import { AddProducerInput, UpdateProducerInput } from '../inputs/ProducerInput';

@resolver(() => ProducerType)
export default class ProducerResolver extends UserResolver {
  @fieldResolver()
  async products(@root() producer: ProducerType) {
    return Producer.getProducts(producer._key);
  }

  @query(() => [ProducerType], { defaultValue: [] })
  async producers() {
    return Producer.getAll();
  }

  @query(() => ProducerType, { nullable: true })
  async producer(@arg('key') key: string) {
    return Producer.get(key);
  }

  @mutation(() => ProducerType, { nullable: true })
  async addProducer(@arg('producer') producer: AddProducerInput) {
    return Producer.add(producer);
  }

  @mutation(() => ProducerType, { nullable: true })
  async removeProducer(@arg('key') key: string) {
    return Producer.remove(key);
  }

  @mutation(() => ProducerType, { nullable: true })
  async updateProducer(@arg('producer') producer: UpdateProducerInput) {
    return Producer.update(producer);
  }
}
