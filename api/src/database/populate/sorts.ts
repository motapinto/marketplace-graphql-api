const addSorts = async (db: any) => {
  const sortsCol = db.collection('sorts');

  return Promise.all([
    sortsCol.save({ name: 'RATING' }),
    sortsCol.save({ name: 'PRICE_LOW_HIGH' }),
    sortsCol.save({ name: 'PRICE_HIGH_LOW' }),
    sortsCol.save({ name: 'MOST_POPULAR' }),
    sortsCol.save({ name: 'MOST_RECENT' }),
    sortsCol.save({ name: 'RECOMENDED' }),
    sortsCol.save({ name: 'SUSTAINABILITY' }),
  ]);
};

export default addSorts;
