pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate configuration') {
            steps {
                sh 'docker compose config -q'
            }
        }

        stage('Build images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Backend tests') {
            steps {
                sh 'docker compose run --rm backend pytest -q'
            }
        }

        stage('Approve deployment') {
            steps {
                input message: 'Tests passed. Deploy this revision to the office server?',
                      ok: 'Approve deployment',
                      submitter: 'admin'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d --remove-orphans'
            }
        }

        stage('Health check') {
            steps {
                sh '''
                    set -eu
                    for attempt in $(seq 1 20); do
                        if curl --fail --silent http://127.0.0.1:8088/ >/dev/null; then
                            echo "Frontend health check passed"
                            exit 0
                        fi
                        sleep 3
                    done
                    echo "Frontend health check failed"
                    docker compose ps
                    docker compose logs --tail=100
                    exit 1
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed. Review the stage logs before retrying.'
        }
        always {
            sh 'docker compose ps || true'
        }
    }
}