const axios = require('axios');
const fs = require('fs');

const prNumber = process.argv[2];
const prBranch = process.argv[3];
const gitHubToken = process.argv[4];
const apiUrl = process.argv[5];

// Fetch the PR diff (the changes)
const getPRChanges = async () => {
    const response = await axios.get(`https://api.github.com/repos/DedSecTeam17/Smart-Places-Search/pulls/${prNumber}`, {
        // headers: {
        //     'Authorization': `token ${gitHubToken}`
        // }
    });

    const diffUrl = response.data.diff_url;
    const diffResponse = await axios.get(diffUrl);

    console.log(diffResponse)

    return diffResponse.data;
};

// Send the changes to your API for review
const reviewChanges = async (changes) => {
    const reviewResponse = await axios.post(apiUrl, { changes });
    return reviewResponse.data.feedback;
};

// Main process
const main = async () => {
    try {
        const changes = await getPRChanges();
        const feedback = await reviewChanges(changes);

        // Save feedback to a file (Jenkins will use it later to post the comment)
        fs.writeFileSync('feedback.txt', feedback);
    } catch (error) {
        console.error('Error reviewing PR:', error);
        process.exit(1);
    }
};

main();