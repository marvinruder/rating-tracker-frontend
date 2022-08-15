pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                yarn run test
            }
        }
    }
}
