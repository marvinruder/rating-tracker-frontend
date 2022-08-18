node {
    stage('Clone repository') {
        checkout scm
    }

    stage ('Run Tests') {
        nodejs(nodeJSInstallationName: 'NodeJS') {
            sh 'yarn install'
            sh 'yarn test:ci'
        }
    }

    stage ('Build Docker Image') {
        def image = docker.build("marvinruder/rating-tracker-frontend:${env.BUILD_ID}")
    }

    stage ('Publish Docker Image') {
        if (env.BRANCH_NAME == 'origin/main') {
            image.push("latest")
        } else {
            image.push("SNAPSHOT")
        }
    }
}
