pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'praneshmanickam'
        IMAGE_NAME = 'nodedockerapp'
        IMAGE_TAG = 'latest'
        SSH_KEY_ID = 'aws-ec2-ssh-key'
        EC2_USER = 'ubuntu'
        EC2_HOST = 'ec2-44-202-2-13.compute-1.amazonaws.com'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/PRANESH-MANICKAM/Node-with-Docker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat "docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker_u_p', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
    docker push %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    sshagent(credentials: ["${SSH_KEY_ID}"]) {
    bat """
        set -x
        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
            docker pull ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} &&
            docker stop ${IMAGE_NAME} || true &&
            docker rm ${IMAGE_NAME} || true &&
            docker run -d --name ${IMAGE_NAME} -p 9000:9000 ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
        '
    """
}
                }
            }
        }
    }

    post {
        success {
            echo '🚀 Deployed successfully!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
