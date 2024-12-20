const axios = require('axios');
const fs = require('fs');

const prNumber = process.argv[2];
const prBranch = process.argv[3];
const gitHubToken = process.argv[4];
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
            'Authorization': `Bearer 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`
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