pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'praneshmanickam'
        IMAGE_NAME = 'nodeapp'
        IMAGE_TAG = 'latest'
        SSH_KEY_ID = 'aws-node-server-key'
        EC2_USER = 'ubuntu'
        EC2_HOST = 'ec2-44-201-109-172.compute-1.amazonaws.com'
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
                    sh "docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push "$DOCKER_USER"/"$IMAGE_NAME":"$IMAGE_TAG"
                    """
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                script {
                    sshagent(credentials: ["${SSH_KEY_ID}"]) {
                        sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << 'EOF'
                        set -e

                        # Install AWS CLI v2 if not already installed
                        if ! command -v aws &> /dev/null; then
                            echo "Installing AWS CLI..."
                            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                            unzip awscliv2.zip
                            sudo ./aws/install
                            rm -rf awscliv2.zip aws
                        fi

                        # Pull Docker image
                        docker pull ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}

                        # Stop and remove old container if running
                        docker stop ${IMAGE_NAME} || true
                        docker rm ${IMAGE_NAME} || true

                        # Download .env from S3
                        aws s3 cp s3://pranesh-noder-server-s3/.env .env

                        # Start container with env file
                        docker run -d --name ${IMAGE_NAME} --env-file .env -p 9000:9000 ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:${IMAGE_TAG}
                    EOF
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
