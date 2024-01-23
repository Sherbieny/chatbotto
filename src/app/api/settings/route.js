import { getDatabase } from "@/app/lib/mongodb";

async function getSettings() {

    try {
        const db = await getDatabase();
        const collection = await db.collection('settings');
        const settings = await collection.find().toArray();
        return new Response(JSON.stringify(settings), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
        return new Response(err, { status: 500 });
    }

}

async function saveSettings(settings) {

    try {
        const db = await getDatabase();
        const collection = await db.collection('settings');

        const operations = settings.map((setting) => {
            return {
                updateOne: {
                    filter: { key: setting.key },
                    update: { $set: { value: setting.value, label: setting.label } },
                    upsert: true
                }
            };
        });

        const result = await collection.bulkWrite(operations);

        if (result.result.ok === 1) {
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
        case 'getSettings':
            // Implementation to get token weight map data from the database
            return getSettings();
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
    let settings;
    try {
        settings = JSON.parse(text);
    } catch (err) {
        return new Response('Invalid JSON', { status: 400 });
    }

    // Validate the JSON
    if (!Array.isArray(settings) || !settings.every(setting => 'key' in setting && 'value' in setting)) {
        return new Response('Invalid settings', { status: 400 });
    }

    switch (action) {
        case 'saveSettings':
            // Implementation to update token weight map data in the database
            return saveSettings(settings);
        default:
            // Response for unspecified action
            return new Response('Action not found', { status: 400 });
    }
}
