import Finder from '../../lib/finder';
import { weightsUpdated } from '../weights/route';
import JaquadProcessor from '@/app/lib/jaquadProcessor';

let finder = new Finder();

weightsUpdated.on('weightsUpdated', () => {
    finder = new Finder();
});

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const tokenizedInput = JSON.parse(searchParams.get('query'));

    switch (action) {
        case 'getSuggestions':
            let suggestions = await finder.getSuggestions(tokenizedInput);
            return new Response(JSON.stringify(suggestions), { status: 200 });
        case 'findBestMatch':
            let bestMatches = await finder.getSuggestions(tokenizedInput);
            return new Response(JSON.stringify(bestMatches), { status: 200 });
        default:
            return new Response('Action not found', { status: 400 });
    }
}

export async function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
        case 'processJaquadData':
            // Get the file content from the request body
            const fileContent = await request.text();
            const jsonData = JSON.parse(fileContent);

            // Process the JSON data using the JaquadProcessor class
            const processor = new JaquadProcessor();
            const qaData = processor.processData(jsonData);

            // Send the processed data in the response
            return new Response(JSON.stringify(qaData), { status: 200 });

        default:
            return new Response('Action not found', { status: 400 });
    }
}