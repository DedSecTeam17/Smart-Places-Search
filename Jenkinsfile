pipeline {
    agent any
    tools {
        nodejs 'nodejs'  // This should match the name you used in Global Tool Configuration
    }
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm packages
                    sh 'npm install'
                }
            }
        }
     stage('Run Node.js Script for PR Review') {
            steps {
                script {
                    // Set environment variables (e.g., GitHub token, API endpoint)
                    def prNumber = env.CHANGE_ID
                    def prBranch = env.CHANGE_BRANCH
                    def openAiToken = credentials('openAiToken') // Store this securely (e.g., Jenkins credentials)
                    def apiUrl = 'https://your-api-url.com/review'
                    
                    // Run Node.js script to get PR changes
                    sh '''
                        npm install
                        node pr-review-script.js 2 $prBranch $openAiToken $apiUrl
                    '''
                }
            }
        }
    }
}