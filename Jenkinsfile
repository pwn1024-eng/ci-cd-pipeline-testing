pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh '''
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                        pytest
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        npm ci || npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}