import { MongoClient, ServerApiVersion } from 'mongodb';

let uri = '';
let tls = true;

if (process.env.NODE_ENV === 'development') {
    uri = process.env.DEV_MONGODB_TEST_URI;
} else if (process.env.NODE_ENV === 'production') {
    uri = process.env.PROD_MONGODB_URI;
}

if (process.env.USE_LOCAL_DB === 'true') {
    uri = process.env.LOCAL_MONGODB_URI;
    tls = false;
}

if (!uri) {
    throw new Error(
        'Please define the DEV_MONGODB_URI or PROD_MONGODB_URI environment variable inside .env.local, current uri = ' + uri
    );
}

let client = null;

async function connectToDatabase() {
    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, {
                serverApi: {
                    version: ServerApiVersion.v1,
                    strict: true,
                    deprecationErrors: true,
                    tls: tls
                }
            });
            global._mongoClientPromise = client.connect();
        }

        client = await global._mongoClientPromise;

        return client;
    } else {
        if (client && client.isConnected()) {
            return client;
        }

        client = await MongoClient.connect(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });
        return client;
    }
}

export async function getDatabase() {
    try {
        const client = await connectToDatabase();
        await client.db('admin').command({ ping: 1 });
        console.log('Connected to database');
        return client.db();
    } catch (err) {
        console.log(err);
    }
}
