class Tokenizer {
    constructor() {
        this.init();
    }

    async init() {
        const response = await fetch('/path/to/model_ja.min.json');
        const model = await response.json();
        this.rakutenma = new RakutenMA(model);
        this.rakutenma.featset = RakutenMA.default_featset_ja;
        this.rakutenma.hash_func = RakutenMA.create_hash_func(15);
    }

    tokenize(text) {
        const tokens = this.rakutenma.tokenize(text);
        return tokens;
    }
}

export default Tokenizer;