import { gql } from 'apollo-server-express';
import { expect } from 'chai';
import { dropDB, populate } from '../../database/populate';
import server from './lazyServer';

describe('Purchases integration tests', async () => {
  const { query, mutate } = await server.value;
  const dbName = 'reviews_test';

  before(async () => {
    await populate(dbName);
  });
  /*
  it('purchase an order', async () => {
    const PURCHASE_ORDER = gql`
      mutation{
        purchase(order: {
          buyerKey: "4670",
          orderKey: "2"
        }){
          buyer,
          status,
          entity
        }
      }
    `;

    const res = await mutate({ mutation: PURCHASE_ORDER });
    expect(res.data.purchase).to.eql({ buyer: '4670', status: PurchaseState.ORDERED, entity: '20658' });
  });

  it('confirm a purchase', async () => {
    const CONFIRM_PURCHASE = gql`
      mutation{
        confirmPurchase(purchase: "1"){
          buyer,
          status,
          entity
        }
      }
    `;

    const res = await mutate({ mutation: CONFIRM_PURCHASE });
    expect(res.data.confirmPurchase).to.eql({ buyer: '4670', status: PurchaseState.PAID, entity: '20658' });
  });

  it('get all purchases', async () => {
    const GET_PURCHASES = gql`
      query{
        purchases(user: "4670"){
          name,
          description,
        }
      }
    `;

    const response = await query({ query: GET_PURCHASES });

    expect(response.data.purchases).to.eql(
      [{
        name: 'Honey 1.0',
        description: 'Very nice honey',
      },
      {
        name: 'Honey 2.0',
        description: 'Improved honey',
      },
      ],
    );
  });
*/
  after(async () => {
    await dropDB(dbName);
  });
});
