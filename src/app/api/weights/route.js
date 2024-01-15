import { getDatabase } from "@/app/lib/mongodb";
import { EventEmitter } from "events";

async function getTokenWeights() {

    try {
        const db = await getDatabase();
        const collection = await db.collection('weights');
        const tokenWeights = await collection.find().toArray();
        return new Response(JSON.stringify(tokenWeights), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return new Response(err, { status: 500 });
    }

}

export const weightsUpdated = new EventEmitter();

async function updateTokenWeights(weightMap) {

    try {
        const db = await getDatabase();
        const collection = await db.collection('weights');

        const operations = weightMap.map((weight) => {
            return {
                updateOne: {
                    filter: { key: weight.key },
                    update: { $set: { value: weight.value } },
                    upsert: true
                }
            };
        });

        const result = await collection.bulkWrite(operations);

        if (result.result.ok === 1) {
            weightsUpdated.emit('weightsUpdated');
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({ success: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
    catch (err) {
        return new Response(err, { status: 500 });
    }

}

export function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
        case 'getTokenWeights':
            // Implementation to get token weight map data from the database
            return getTokenWeights();
        default:
            // Response for unspecified action
            return new Response('Action not found', { status: 400 });
    }
}

export async function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    // Convert the ReadableStream to text
    const text = await new Response(request.body).text();

    // Parse the text as JSON
    let weightMap;
    try {
        weightMap = JSON.parse(text);
    } catch (err) {
        return new Response('Invalid JSON', { status: 400 });
    }

    switch (action) {
        case 'updateTokenWeights':
            // Implementation to update token weight map data in the database
            return updateTokenWeights(weightMap);
        default:
            // Response for unspecified action
            return new Response('Action not found', { status: 400 });
    }
}
