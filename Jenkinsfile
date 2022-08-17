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
            steps {
                script {
                    sh 'yarn install --production'
                    sh 'yarn build'
                }
            }
        }
    }
}
