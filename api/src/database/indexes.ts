export const indexes = [
  {
    type: 'persistent',
    fields: ['price'],
    name: 'productPriceIndex',
    unique: false,
    sparse: true,
    collection: 'products',
    collectionType: 'document',
  },
  {
    type: 'geo',
    fields: ['location'],
    name: 'productLocationIndex',
    geoJson: true,
    collection: 'products',
    collectionType: 'document',
  },
];
