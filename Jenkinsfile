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
          withRegistry('https://docker.mycorp.com/', 'ana-docker'){
          script{
            docker.build('"patanna/simple-nodejs-app"').push('latest')
          }
          }
        }
      }
    }

    stage('Get the image hash') {
      steps{
        echo "Image hash is: "
      }
    }




    stage('Deploy with ArgoCD') {
      steps{
          echo "Changed the image hash to: "

          echo "Pushed the configs to the repo"

          echo "Deployed with ArgoCD"
      }
    }
  }
}