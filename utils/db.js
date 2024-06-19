import { MongoClient } from 'mongodb';
// import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';

class DBClient {
    constructor() {
        envLoader();

        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const dbURL = `mongodb://${host}:${port}/${database}`;
    
        this.client = new MongoClient(dbURL, { useUnifiedTopology: true });
        this.client.connect().then(() => {
            console.log('Connected to database');
        }).catch((err) => {
            console.error('Database connection failed', err);
        });
    
      }    

    isAlive() {
        // return this.client._ending === false;
        return this.client.isConnected();

    }

        
    async nbUsers() {
       return await this.client.db().collection('users').countDocuments();
    }

    async nbFiles() {
       return await this.client.db().collection('files').countDocuments();  
    }

}

const dbClient = new DBClient();
export default dbClient;