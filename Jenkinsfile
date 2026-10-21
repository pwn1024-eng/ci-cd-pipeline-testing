
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        skipDefaultCheckout(true)
    }

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
        FRONTEND_URL = 'http://127.0.0.1:8088/'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh '''
                    set -eu
                    echo "Repository: $PWD"
                    test -f "$COMPOSE_FILE"
                    test -f backend/requirements.txt
                    test -f backend/app.py
                    test -f frontend/package.json
                    test -f frontend/Dockerfile
                    test -f backend/Dockerfile
                    echo "Required project files found."
                '''
            }
        }

        stage('Validate Compose') {
            steps {
                sh '''
                    set -eu
                    docker compose -f "$COMPOSE_FILE" config -q
                    echo "Docker Compose configuration is valid."
                '''
            }
        }

        stage('Backend Tests') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                      -v "$WORKSPACE/backend:/app" \
                      -w /app \
                      python:3.12-slim \
                      sh -lc '
                        set -eu
                        python -m pip install --no-cache-dir \
                          -r requirements.txt pytest
                        python -m pytest -v --tb=short
                      '
                '''
            }
        }

        stage('Frontend Tests and Build') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                      -v "$WORKSPACE/frontend:/app" \
                      -w /app \
                      node:22-alpine \
                      sh -lc '
                        set -eu
                        npm ci

                        if node -e "
                          process.exit(
                            require('./package.json').scripts?.test ? 0 : 1
                          )
                        "; then
                          echo "Running frontend tests..."
                          CI=true npm test
                        else
                          echo "No frontend test script configured."
                        fi

                        echo "Building frontend..."
                        npm run build
                      '
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    set -eu
                    docker compose -f "$COMPOSE_FILE" build
                    echo "Docker images built successfully."
                '''
            }
        }

        stage('Deployment Approval') {
            steps {
                input message: 'All tests passed. Deploy the application?',
                      ok: 'Deploy'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    set -eu
                    docker compose -f "$COMPOSE_FILE" up -d --remove-orphans
                    docker compose -f "$COMPOSE_FILE" ps
                '''
            }
        }

        stage('Post-Deployment Smoke Tests') {
            steps {
                sh '''
                    set -eu

                    echo "Waiting for frontend..."
                    success=0

                    for attempt in $(seq 1 30); do
                        if curl --fail --silent --show-error \
                            --output /dev/null "$FRONTEND_URL"; then
                            success=1
                            break
                        fi
                        sleep 2
                    done

                    if [ "$success" -ne 1 ]; then
                        echo "Frontend health check failed."
                        docker compose -f "$COMPOSE_FILE" ps
                        docker compose -f "$COMPOSE_FILE" logs --tail=100
                        exit 1
                    fi

                    echo "Frontend HTTP check passed."
                    docker compose -f "$COMPOSE_FILE" ps
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed. Review the stage logs before redeploying.'
            sh '''
                docker compose -f "$COMPOSE_FILE" ps || true
            '''
        }

        always {
            echo 'Pipeline finished.'
            deleteDir()
        }
    }
}
