pipeline {
    agent any
    environment {
        NODE_VERSION = '18.20.5' // Set your desired Node.js version
    }
    tools {
        nodejs NODE_VERSION
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
       
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}
