pipeline {
    agent any
    tools { nodejs "NodeJS" }
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
            steps {
                sh 'echo Build successful'
            }
         }
     }
}
