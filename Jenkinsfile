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
                        export PYTHONPATH=$PWD
                        pytest
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