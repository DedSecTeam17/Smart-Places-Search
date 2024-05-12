const OpenAIApi = require('openai');

async function openaiEmbed(textData) {
    const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textData,
            encoding_format: "float",
        });
        return response["data"][0]["embedding"];
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
}

module.exports = {
    openaiEmbed,
}