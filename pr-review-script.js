const axios = require('axios');
const fs = require('fs');

const prNumber = process.argv[2];
const prBranch = process.argv[3];
const openAiToken = process.argv[4];
const apiUrl = process.argv[5];

// Fetch the PR diff (the changes)
const getPRChanges = async () => {
    const response = await axios.get(`https://api.github.com/repos/DedSecTeam17/Smart-Places-Search/pulls/${prNumber}`, {
    });

    const diffUrl = response.data.diff_url;
    const diffResponse = await axios.get(diffUrl);

    console.log(diffResponse)

    return diffResponse.data;
};

// Send the changes to your API for review
const reviewChanges = async (changes) => {
    const reviewResponse = await axios.post("https://api.openai.com/v1/chat/completions", { 
        "model": "gpt-4o",
        "messages": [
          {
            "role": "developer",
            "content": `eview each line of the Pull Request diff, suggesting code enhancements and checking adherence to best coding practices, performance, security, error handling, and documentation. Ensure consistency with project standards, optimize performance, and propose additional improvements where necessary. : ${changes}`
          }
        ]
 },{
         headers: {
            'Authorization': `Bearer ${openAiToken}`
        }
    });
    return reviewResponse.data.choices[0]["message"]["content"];
};

// Main process
const main = async () => {
    try {
        const changes = await getPRChanges();
        const feedback = await reviewChanges(changes);
        fs.writeFileSync('feedback.txt', feedback);
    } catch (error) {
        console.error('Error reviewing PR:', error);
        process.exit(1);
    }
};

main();