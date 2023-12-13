import { getDatabase } from "@/app/lib/mongodb";

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

export function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
        case 'getTokenWeights':
            // Implementation to get token weight map data from the database
            return getTokenWeights();
            break;
        default:
            // Response for unspecified action
            return new Response('Action not found', { status: 400 });
    }
}

export function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
        case 'updateTokenWeights':
            // Implementation to update token weight map data in the database
            break;
        default:
            // Response for unspecified action
            return new Response('Action not found', { status: 400 });
    }
}
