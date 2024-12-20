pipeline {
    agent any
    tools {
        nodejs '18.20.5'  // This should match the name you used in Global Tool Configuration
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
        stage('Build') {
            steps {
                script {
                    // Run the build command
                    sh 'npm run build'
                }
            }
        }
    }
}