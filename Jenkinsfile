pipeline {
    agent any 

    environment {
        NODE_VERSION = '14' // Specify your Node.js version
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository from GitHub
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Use Node.js version specified in the environment variable
                    sh "nvm install ${NODE_VERSION}"
                    sh "nvm use ${NODE_VERSION}"
                }
                // Install project dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                // Build the application
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                // Add your deployment commands here
                echo 'Deploying application...'
                // Example: sh './deploy.sh'
            }
        }
    }

    post {
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
