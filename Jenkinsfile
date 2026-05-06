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

                    bat '''
                    docker build -t %DOCKER_HUB%/backend:%IMAGE_TAG% .
                    '''
                }
            }
        }

        stage('Build Frontend Image') {

            steps {

                dir('frontend') {

                    bat '''
                    docker build -t %DOCKER_HUB%/frontend:%IMAGE_TAG% .
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

                    bat '''
                    echo %PASS% | docker login -u %USER% --password-stdin

                    docker push %DOCKER_HUB%/backend:%IMAGE_TAG%

                    docker push %DOCKER_HUB%/frontend:%IMAGE_TAG%
                    '''
                }
            }
        }

        stage('Deploy to EC2') {

            steps {

                sshagent(['ssh-creds']) {

                    bat """
                    ssh -o StrictHostKeyChecking=no ubuntu@%EC2_IP% "

                    docker pull %DOCKER_HUB%/backend:%IMAGE_TAG%

                    docker pull %DOCKER_HUB%/frontend:%IMAGE_TAG%

                    docker stop backend || exit 0
                    docker rm backend || exit 0

                    docker stop frontend || exit 0
                    docker rm frontend || exit 0

                    docker network create app-network || exit 0

                    docker run -d --name backend --network app-network -p 5000:5000 %DOCKER_HUB%/backend:%IMAGE_TAG%

                    docker run -d --name frontend --network app-network -p 3000:3000 %DOCKER_HUB%/frontend:%IMAGE_TAG%
                    "
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
