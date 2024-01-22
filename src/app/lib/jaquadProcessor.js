class JaquadProcessor {
    validateData(jsonData) {
        if (!jsonData.data) {
            throw new Error('Invalid data: missing "data" property');
        }

        jsonData.data.forEach((item, index) => {
            if (!item.paragraphs) {
                throw new Error(`Invalid data: missing "paragraphs" property in data[${index}]`);
            }

            item.paragraphs.forEach((paragraph, index) => {
                if (!paragraph.qas) {
                    throw new Error(`Invalid data: missing "qas" property in paragraphs[${index}]`);
                }

                paragraph.qas.forEach((qa, index) => {
                    if (!qa.question || !qa.answers || !qa.answers[0] || !qa.answers[0].text) {
                        throw new Error(`Invalid data: missing "question" or "answers" property in qas[${index}]`);
                    }
                });
            });
        });
    }

    processData(jsonData) {
        this.validateData(jsonData);

        const qaData = [];

        jsonData.data.forEach((item) => {
            item.paragraphs.forEach((paragraph) => {
                paragraph.qas.forEach((qa) => {
                    qaData.push({
                        prompt: qa.question,
                        answer: qa.answers[0].text,
                    });
                });
            });
        });

        return qaData;
    }
}

export default JaquadProcessor;