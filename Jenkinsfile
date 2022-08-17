node {
    def app

    stage('Clone repository') {
        /* Let's make sure we have the repository cloned to our workspace */

        checkout scm
    }

    stage('Test image') {
        steps {
            script {
                sh 'yarn install'
                sh 'yarn test:ci'
            }
        }
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("mruder/rating-tracker-frontend")
    }
 }
