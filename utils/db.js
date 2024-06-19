import { MongoClient } from 'mongodb';
import Collection from 'mongodb/lib/collection';
// import envLoader from './env_loader';

class DBClient {
    constructor() {
        // envLoader();

        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const dbURL = `mongodb://${host}:${port}/${database}`;
    
        this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
        this.client.connect();
      }    

    isAlive() {
        return this.client._ending === false;
        // return this.client.connected;

    }

        
    async nbUsers() {
       return this.client.db('files_manager').collection('users').countDocuments();
    }

    async nbFiles() {
       return this.client.db('files_manager').collection('files').countDocuments();  
    }

}

const dbClient = new DBClient();
export default dbClient;
