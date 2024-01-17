import { getDatabase } from '@/app/lib/mongodb';

class Finder {
    constructor() {

    }

    async getSuggestions(tokenizedInput) {
        if (!tokenizedInput || tokenizedInput.length === 0) {
            return [];
        }

        const db = await getDatabase();

        const searchTerms = tokenizedInput.map(([term, pos]) => ({ prompt: { $regex: term, $options: 'i' } }));
        const prompts = await db.collection('qa').find({ $or: searchTerms }).toArray();

        return prompts;
    }
}

export default Finder;