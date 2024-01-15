import Tokenizer from './tokenizer';
import { getDatabase } from '@/app/lib/mongodb';

class Finder {
    constructor() {
        this.tokenizer = new Tokenizer();
        this.init();
    }

    async init() {
        const db = await getDatabase();
        this.weightsMap = await db.collection('weights').find().toArray();

        this.weights = {};
        this.weightsMap.forEach(item => {
            this.weights[item.key] = item.value;
        });
    }

    async calculateScore(tokenizedInput, tokenizedQuestion) {
        let score = 0;

        const inputTokens = new Set(tokenizedInput.map(([token, tag]) => token));

        for (const [questionToken, questionTag] of tokenizedQuestion) {
            if (inputTokens.has(questionToken)) {
                const weight = this.weights[questionTag] || 0;
                score += weight;
            }
        }

        return score;
    }

    async findBestMatches(input) {
        const db = await getDatabase();
        const tokenizedInput = this.tokenizer.tokenize(input);

        // Filter out tokens with weights larger than zero
        const weightedTokens = tokenizedInput.filter(([token, tag]) => this.weights[tag] > 0);

        // Perform a text search query for each weighted token
        const prompts = await Promise.all(weightedTokens.map(([token, tag]) =>
            db.collection('qa').find({ $text: { $search: token } }).toArray()
        ));

        // Flatten the array of arrays
        const flatPrompts = prompts.flat();

        const tokenizedPrompts = flatPrompts.map(prompt => ({
            ...prompt,
            tokens: this.tokenizer.tokenize(prompt.prompt)
        }));

        const rankedPrompts = tokenizedPrompts.map(prompt => {
            const score = this.calculateScore(tokenizedInput, prompt.tokens);
            return { prompt: prompt.prompt, score: score };
        });

        rankedPrompts.sort((a, b) => b.score - a.score);

        const bestMatch = rankedPrompts[0];
        const answer = flatPrompts.find(prompt => prompt.prompt === bestMatch.prompt).answer;

        return answer;
    }

    // Similar changes would be made to the getSuggestions method

    async getSuggestions(input) {
        const db = await getDatabase();
        const tokenizedInput = this.tokenizer.tokenize(input);

        // Filter out tokens with weights larger than zero
        const weightedTokens = tokenizedInput.filter(([token, tag]) => this.weights[tag] > 0);

        // Perform a text search query for each weighted token
        const prompts = await Promise.all(weightedTokens.map(([token, tag]) =>
            db.collection('qa').find({ $text: { $search: token } }).toArray()
        ));

        // Flatten the array of arrays
        const flatPrompts = prompts.flat();

        const tokenizedPrompts = flatPrompts.map(prompt => ({
            ...prompt,
            tokens: this.tokenizer.tokenize(prompt.prompt)
        }));

        const rankedPrompts = tokenizedPrompts.map(prompt => {
            const score = this.calculateScore(tokenizedInput, prompt.tokens);
            return { prompt: prompt.prompt, score: score };
        });

        rankedPrompts.sort((a, b) => b.score - a.score);

        // Return the top 5 suggestions
        const suggestions = rankedPrompts.slice(0, 5).map(prompt => prompt.prompt);

        return suggestions;
    }
}

export default Finder;