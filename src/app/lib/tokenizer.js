import RakutenMA from 'rakutenma';

class Tokenizer {
    constructor() {
        this.rakutenma = new RakutenMA(require('rakutenma/model_ja'));
    }

    tokenize(text) {
        const tokens = this.rakutenma.tokenize(text);
        return tokens;
    }
}

export default Tokenizer;