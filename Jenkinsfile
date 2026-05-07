pipeline {

    agent any

    environment {

        DOCKER_HUB = "irfaanpk"

        IMAGE_TAG = "${BUILD_NUMBER}"

        DEPLOY_SERVER = "35.175.211.245"
    }

    stages {

        stage('Clone Code') {

            steps {

                git branch: 'main',
                url: 'https://github.com/Irfaanpk/demo-jenkins.git'
            }
        }

        stage('Build Backend Image') {

            steps {

                dir('backend') {

                    sh '''
                    docker build -t $DOCKER_HUB/backend:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {

            steps {

                dir('frontend') {

                    sh '''
                    docker build -t $DOCKER_HUB/frontend:$IMAGE_TAG .
                    '''
                }
            }
        }

        stage('Push Images') {

            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {

                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin

                    docker push $DOCKER_HUB/backend:$IMAGE_TAG

                    docker push $DOCKER_HUB/frontend:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Deploy') {

            steps {

                sshagent(['ssh-creds']) {

                    sh '''
                    scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@$DEPLOY_SERVER:/home/ubuntu/

                    ssh -o StrictHostKeyChecking=no ubuntu@$DEPLOY_SERVER "

                    export IMAGE_TAG=$IMAGE_TAG

                    docker-compose down || true

                    docker-compose pull

                    docker-compose up -d
                    "
                    '''
                }
            }
        }
    }

    post {

        success {

            echo 'Deployment Successful 🚀'
        }

        failure {

            echo 'Deployment Failed ❌'
        }
    }
}
