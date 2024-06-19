import { MongoClient } from 'mongodb';
import envLoader from './env_loader';

class DBClient {
  constructor () {
    envLoader();

    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const dbURL = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive () {
    return this.client._ending === false;
  }

  async nbUsers () {
    const res = await this.client.db.Collection('users').countDocuments();
    return res;
  }

  async nbFiles () {
    const res = await this.client.db.Collection('files').countDocuments();
    return res;
  }
}

const dbClient = new DBClient();
export default dbClient;
