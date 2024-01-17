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
let db = null;

async function connectToDatabase() {
    if (db) {
        return db;
    }
    console.log('Connecting to database');
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
        db = client.db();

        return db;
    } else {
        if (client && client.isConnected()) {
            db = client.db();
            return db;
        }

        client = await MongoClient.connect(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true
            }
        });

        db = client.db();
        return db;
    }
}

export async function getDatabase() {
    try {
        const db = await connectToDatabase();
        await db.command({ ping: 1 });
        return db;
    } catch (err) {
        console.log(err);
    }
}
