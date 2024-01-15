import Finder from '../../lib/finder';
import { weightsUpdated } from '../weights/route';

let finder = new Finder();

weightsUpdated.on('weightsUpdated', () => {
    finder = new Finder();
});

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const query = searchParams.get('query');

    switch (action) {
        case 'getSuggestions':
            const suggestions = await finder.getSuggestions(query);
            return new Response(JSON.stringify(suggestions), { status: 200 });
        case 'findBestMatch':
            const bestMatch = await finder.findBestMatches(query);
            return new Response(JSON.stringify(bestMatch), { status: 200 });
        default:
            return new Response('Action not found', { status: 400 });
    }
}

export function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
        case 'queryAnswers':
            // Implementation to update token weight map data in the database
            break;
        default:
            return new Response('Action not found', { status: 400 });
    }
}