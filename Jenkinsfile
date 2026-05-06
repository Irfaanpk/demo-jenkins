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

        stage('Build Docker Images') {

            steps {

                sh '''
                docker build -t $DOCKER_HUB/backend:$IMAGE_TAG ./backend

                docker build -t $DOCKER_HUB/frontend:$IMAGE_TAG ./frontend
                '''
            }
        }

        stage('Push Docker Images') {

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

        stage('Deploy to EC2') {

            steps {

                sshagent(['ec2-ssh']) {

                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP '

                    docker stop frontend || true
                    docker rm frontend || true

                    docker stop backend || true
                    docker rm backend || true

                    docker pull $DOCKER_HUB/backend:$IMAGE_TAG
                    docker pull $DOCKER_HUB/frontend:$IMAGE_TAG

                    docker network create app-network || true

                    docker run -d \
                    --name backend \
                    --network app-network \
                    -p 5000:5000 \
                    $DOCKER_HUB/backend:$IMAGE_TAG

                    docker run -d \
                    --name frontend \
                    --network app-network \
                    -p 3000:3000 \
                    $DOCKER_HUB/frontend:$IMAGE_TAG
                    '
                    """
                }
            }
        }
    }
}
