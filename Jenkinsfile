pipeline {
    agent any

    environment {
        DOCKER_USER = "omkar797283"               // 👈 Your Docker Hub username
        IMAGE_NAME = "my-demo-web"
        IMAGE_TAG = "latest"
        DOCKER_HUB_CRED = "DOCKER_PASS_ID"       // Jenkins credentials ID (Username+Password)
        CONTAINER_NAME = "my-web-container"
    }

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/omkar2203030/DEMO.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                    docker --version
                    docker build -t %IMAGE_NAME%:%IMAGE_TAG% .
                    docker tag %IMAGE_NAME%:%IMAGE_TAG% %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }

        stage('Login & Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CRED, usernameVariable: 'DOCKER_USER_VAR', passwordVariable: 'DOCKER_PASS')]) {
                    bat """
                        echo %DOCKER_PASS% | docker login -u %DOCKER_USER_VAR% --password-stdin
                        docker push %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                    """
                }
            }
        }

        stage('Deploy Container') {
            steps {
                bat """
                    REM Stop and remove existing container if it exists
                    docker rm -f %CONTAINER_NAME% || exit 0

                    REM Run new container
                    docker run -d -p 8085:80 --name %CONTAINER_NAME% %DOCKER_USER%/%IMAGE_NAME%:%IMAGE_TAG%
                """
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}