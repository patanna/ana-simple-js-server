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
    stage('Build-Docker-Image') {
      steps {
        container('docker') {
          sh 'docker build -t patanna/node:12.22.9-slim .'
        }
      }
    }

    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'git') {
        app.push("patanna/simple-nodejs-app")            
        app.push("latest")        
    }    
    }

  }
}