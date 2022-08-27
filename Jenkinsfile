node {
    withEnv([
        'imagename=marvinruder/rating-tracker-frontend',
        'main_tag=latest',
        'branch_tag=SNAPSHOT',
    ]) {

        def GIT_COMMIT_HASH

        stage('Clone repository') {
            checkout scm
            GIT_COMMIT_HASH = sh (script: "git log -n 1 --pretty=format:'%H'", returnStdout: true)
        }

        stage('Create yarn caches') {
            nodejs(nodeJSInstallationName: 'node16') {
                sh 'yarn install'
            }
        }

        stage ('Run Tests') {
            sh 'mkdir -p coverage'
            docker.build("$imagename:build-$GIT_COMMIT_HASH-test", "--target test .").run("-v coverage:/app/coverage -a STDOUT")
            withCredentials([string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
                sh """
                curl -Os https://uploader.codecov.io/latest/alpine/codecov
                chmod +x ./codecov
                ls -la .
                ./codecov -s coverage
                """
            }
        }

        def image

        stage ('Build Docker Image') {
            image = docker.build("$imagename:build-$GIT_COMMIT_HASH", "--target run .")
        }

        stage ('Publish Docker Image') {
            docker.withRegistry('', 'dockerhub') {
                if (env.BRANCH_NAME == 'main') {
                    image.push(main_tag)
                } else if (!(env.BRANCH_NAME).startsWith('renovate')) {
                    image.push(branch_tag)
                }
            }
        }

        stage ('Cleanup') {
            sh """
            docker rmi $imagename:build-$GIT_COMMIT_HASH-test || true
            docker rmi $imagename:build-$GIT_COMMIT_HASH || true
            """
            if (env.BRANCH_NAME == 'main') {
                sh "docker rmi $imagename:$main_tag || true"
            } else if (!(env.BRANCH_NAME).startsWith('renovate')) {
                sh "docker rmi $imagename:$branch_tag || true"
            }
        }
    }
}
