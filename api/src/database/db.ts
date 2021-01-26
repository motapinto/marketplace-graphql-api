import { Database } from 'arangojs';
import {
  CollectionType,
  CollectionImportResult,
  CollectionImportOptions,
  CollectionRemoveOptions,
  CollectionUpdateOptions,
  CollectionInsertOptions,
  CollectionReadOptions,
} from 'arangojs/collection';
import { DocumentSelector, DocumentData } from 'arangojs/documents';
import { ArrayCursor } from 'arangojs/cursor';
import { indexes } from './indexes';

let db: Database;

interface ArangoDB {
  dbURL: string
  dbUser: string
  dbPass: string
  dbName: string
}

const openCollection = async (
  name: string,
  type: CollectionType.EDGE_COLLECTION |
  CollectionType.DOCUMENT_COLLECTION = CollectionType.DOCUMENT_COLLECTION,
):
Promise<void> => {
  try {
    const col = db.collection(name);
    const exist = await col.exists();
    if (!exist) {
      try {
        await col.create({ type });
      } catch (error) {
        console.error(`Unable to create collection ${name}. Error: ${error.message}`); // eslint-disable-line
      }
    }
  } catch (error) {
    console.error(`Unable to execute exists in collection ${name}. Error: ${error.message}`); // eslint-disable-line
  }
};

const openView = async (name: string): Promise<void> => {
  try {
    const view = db.view(name);
    const exist = await view.exists();
    if (!exist) {
      try {
        await view.create();
      } catch (error) {
        console.error(`Unable to create view. Error: ${error.message}`); // eslint-disable-line
      }
    }
  } catch (error) {
    console.error(`Unable to execute exists. Error: ${error.message}`); // eslint-disable-line
  }
};

const addCollections = async () => Promise.all([
  await openCollection('categories', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('sorts', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('images', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('locations', CollectionType.DOCUMENT_COLLECTION),

  await openCollection('buyers', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('producers', CollectionType.DOCUMENT_COLLECTION),

  await openCollection('products', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('carts', CollectionType.DOCUMENT_COLLECTION),
  await openCollection('orders', CollectionType.DOCUMENT_COLLECTION),
]);

const addViews = async () => openView('products_view');

const addEdges = async () => Promise.all([
  await openCollection('products_categories', CollectionType.EDGE_COLLECTION),
  await openCollection('buyers_categories', CollectionType.EDGE_COLLECTION),
  await openCollection('reviews', CollectionType.EDGE_COLLECTION),
  await openCollection('ordered_by', CollectionType.EDGE_COLLECTION),
  await openCollection('produced_by', CollectionType.EDGE_COLLECTION),
  await openCollection('ordered_product', CollectionType.EDGE_COLLECTION),
]);

const createIndex = async (colName: string, index: any): Promise<any> => {
  try {
    const col = db.collection(colName);
    return await col.ensureIndex(index);
  } catch (error) {
    console.error(`Unable to create index ${index.name} for collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};

const setArangoSearch = async () => {
  const productView = db.view('products_view');

  const link = {
    includeAllFields: true,
    fields: {
      name: { analyzers: ['text_en'] },
      description: { analyzers: ['text_en'] },
    },
  };

  return productView.updateProperties({ links: { products: link } });
};

const initialize = async (arangoDatabase: ArangoDB): Promise<Database> => {
  db = new Database({
    url: arangoDatabase.dbURL,
    auth: {
      username: arangoDatabase.dbUser,
      password: arangoDatabase.dbPass,
    },
  });

  try {
    const names = await db.listDatabases();
    names.indexOf(arangoDatabase.dbName) === -1
      ? db = await db.createDatabase(arangoDatabase.dbName) : db = db.database(arangoDatabase.dbName);
    await Promise.all([await addCollections(), await addViews(), await addEdges()]);
    await setArangoSearch();
    indexes.forEach((index) => createIndex(index.collection, index));
  } catch (e) {
    throw new Error(`Failed to create DB! Error: ${e.message}`);
  }

  return db;
};

const createDocument = async (colName: string, document: DocumentData, options?: CollectionInsertOptions): Promise<any> => {
  try {
    const col = db.collection(colName);
    if ((document._key && !await col.documentExists(document._key)) || !document._key) {
      return await col.save(document, options);
    }
  } catch (error) {
    console.error(`Unable to create document ${document._key} in collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};

const getDocument = async (colName: string, docKey: DocumentSelector, options?: CollectionReadOptions): Promise<any> => {
  try {
    const col = db.collection(colName);
    return await col.document(docKey, options);
  } catch (error) {
    console.error(`Unable to get document. Error: ${error.message}`); // eslint-disable-line
  }
};

const updateDocument = async (colName: string, document: DocumentData, options?: CollectionUpdateOptions): Promise<any> => {
  try {
    const col = db.collection(colName);
    return await col.update(document._key, document, options);
  } catch (error) {
    console.error(`Unable to update document. Error: ${error.message}`); // eslint-disable-line
  }
};

const replaceDocument = async<T extends object> (
  colName: string,
  document: DocumentData<T>,
  options?: CollectionUpdateOptions): Promise<any> => {
  try {
    const col = db.collection(colName);

    if (!document._key || !await col.documentExists(document._key)) {
      return await createDocument(colName, document, options);
    }

    return await col.replace(document._key, document, options);
  } catch (error) {
    console.error(`Unable to replace document. Error: ${error.message}`); // eslint-disable-line
  }
};

const removeDocument = async (colName: string, docKey: DocumentSelector, options?: CollectionRemoveOptions): Promise<any> => {
  try {
    const col = db.collection(colName);
    return await col.remove(docKey, options);
  } catch (error) {
    console.error(`Unable to remove document. Error: ${error.message}`); // eslint-disable-line
  }
};

const bulkInsert = async<T extends object> (
  colName: string,
  documents: DocumentData<T>[],
  options?: CollectionImportOptions): Promise<CollectionImportResult> => {
  try {
    const col = db.collection(colName);
    return await col.import(documents, options);
  } catch (error) {
    console.error(`Unable to create document. Error: ${error.message}`); // eslint-disable-line
  }
};

const query = async (q: string): Promise<ArrayCursor<any>> => {
  try {
    return await db.query(q);
  } catch (error) {
    console.error(`Unable to execute query. Error: ${error.message}`); // eslint-disable-line
  }
};

const removeByFrom = async (colName: string, keys: string[]): Promise<ArrayCursor<any>> => {
  try {
    return keys.length !== 0 ? await db.query(`
      FOR key IN ${keys}
      LET doc = DOCUMENT(${colName}, _from)
      FILTER doc
      REMOVE doc IN ${colName}
    `) : null;
  } catch (error) {
    console.error(`Unable to execute removeByFrom in collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};

const removeByExample = async (colName: string, attr: string, val: string): Promise<ArrayCursor<any>> => {
  try {
    return await db.query(`
      FOR doc IN ${colName}
      FILTER doc.${attr} == "${val}"
      REMOVE doc IN ${colName}
      RETURN 1
    `);
  } catch (error) {
    console.error(`Unable to execute removeByExample in collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};

// Get Documents connected from {colName} edge collection to {to} document collections
const inEdges = async (colName: string, to: string): Promise<any> => {
  try {
    const cursor = await query(`
      FOR v IN 1..1 
      INBOUND '${to}' ${colName}
      RETURN v
    `);

    return await cursor.all();
  } catch (error) {
    console.error(`Unable to execute inEdges in collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};
// Get Documents connected to {colName} edge collection from {from} document collections
const outEdges = async (colName: string, from: string): Promise<any> => {
  try {
    const cursor = await query(`
      FOR v IN 1..1 
      OUTBOUND '${from}' ${colName}
      RETURN v
    `);
    

    return await cursor.all();
  } catch (error) {
    console.error(`Unable to execute outEdges in collection ${colName}. Error: ${error.message}`); // eslint-disable-line
  }
};

export = {
  initialize,
  openCollection,
  createIndex,
  createDocument,
  getDocument,
  updateDocument,
  replaceDocument,
  removeDocument,
  bulkInsert,
  query,
  removeByFrom,
  removeByExample,
  inEdges,
  outEdges,
};
