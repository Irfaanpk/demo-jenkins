pipeline {

    agent any

    environment {
        DOCKER_HUB = "irfaanpk"
        IMAGE_TAG = "${BUILD_NUMBER}"
        EC2_IP = "54.234.197.248"
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
                    sh """
                    docker build -t $DOCKER_HUB/backend:$IMAGE_TAG .
                    docker tag $DOCKER_HUB/backend:$IMAGE_TAG $DOCKER_HUB/backend:latest
                    """
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('frontend') {
                    sh """
                    docker build -t $DOCKER_HUB/frontend:$IMAGE_TAG .
                    docker tag $DOCKER_HUB/frontend:$IMAGE_TAG $DOCKER_HUB/frontend:latest
                    """
                }
            }
        }

        stage('Push Images') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'docker-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin

                    docker push $DOCKER_HUB/backend:$IMAGE_TAG
                    docker push $DOCKER_HUB/backend:latest

                    docker push $DOCKER_HUB/frontend:$IMAGE_TAG
                    docker push $DOCKER_HUB/frontend:latest
                    """
                }
            }
        }

        stage('Deploy to EC2') {

            steps {

                sshagent(['ssh-creds']) {

                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP '

                    docker pull $DOCKER_HUB/backend:latest
                    docker pull $DOCKER_HUB/frontend:latest

                    docker stop backend || true
                    docker rm backend || true

                    docker stop frontend || true
                    docker rm frontend || true

                    docker network create app-network || true

                    docker run -d \
                    --name backend \
                    --network app-network \
                    -p 5000:5000 \
                    --restart always \
                    $DOCKER_HUB/backend:latest

                    docker run -d \
                    --name frontend \
                    --network app-network \
                    -p 3000:3000 \
                    --restart always \
                    $DOCKER_HUB/frontend:latest

                    docker image prune -f
                    '
                    """
                }
            }
        }
    }

    post {

        success {
            echo 'Deployment Successful'
        }

        failure {
            echo 'Deployment Failed'
        }
    }
}
