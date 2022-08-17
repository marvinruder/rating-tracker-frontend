pipeline {
    tools {
        nodejs 'default-nodejs'
    }
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    sh 'yarn install'
                    sh 'yarn test:ci'
                }
            }
        }
        stage('Build') {
            agent { dockerfile true }
        }
    }
}
