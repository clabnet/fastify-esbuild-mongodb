import {
  Database,
  Service,
  ServiceOptions,
  IDocument
} from '@paralect/node-mongo'

const database = new Database(process.env.MONGO_URL)
database.connect()

class CustomService<T extends IDocument> extends Service<T> {
  // You can add new methods or override existing here
}

function createService<T extends IDocument>(
  collectionName: string,
  options: ServiceOptions = {}
) {
  return new CustomService<T>(collectionName, database, options)
}

export default {
  database,
  createService
}
