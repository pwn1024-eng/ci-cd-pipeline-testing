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
                        set -eu
                        python3 -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                        export PYTHONPATH=$PWD
                        pytest
                    '''
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh '''
                        set -eu
                        docker run --rm \
                          -v "$WORKSPACE/frontend:/app" \
                          -w /app \
                          node:22-alpine \
                          sh -lc 'npm ci && npm run build'
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    set -eu
                    docker compose build
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    docker compose config -q
                    docker compose up -d --remove-orphans
                    docker compose ps
                '''
            }
        }
    }

    post {
        always {
            deleteDir()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}