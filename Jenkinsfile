pipeline {
  agent {
    kubernetes {
      yaml '''
        apiVersion: v1
        kind: Pod
        spec:
          containers:
          - name: docker
            image: docker:latest
            command:
            - cat
            tty: true
            volumeMounts:
             - mountPath: /var/run/docker.sock
               name: docker-sock
          volumes:
          - name: docker-sock
            hostPath:
              path: /var/run/docker.sock    
        '''
    }
  }
  stages {
    stage('Checkout Code') {
            steps {
                git branch: 'main', url:'https://github.com/patanna/ana-simple-js-server.git'
            }
    }
    stage('Build-Push-Docker-Image') {
      steps {
        container('docker') {
          script{
          docker.withRegistry('https://docker.mycorp.com/', 'ana-docker') {
            docker.build('"patanna/simple-nodejs-app"').push('latest')
          }
          }
        }
      }
    }

  }
}