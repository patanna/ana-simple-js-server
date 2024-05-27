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
              git branch: 'main', credentialsId: 'ana-git-userpass', url: 'https://github.com/patanna/ana-simple-js-server/'
            }
    }
    stage('Build-Push-Docker-Image') {
      steps {
        container('docker') {
          script{
            withDockerRegistry(credentialsId: 'ana-docker'){
            docker.build('patanna/simple-nodejs-app').push("${GIT_BRANCH}_${GIT_COMMIT}")
          }
          }
        }
      }
    }

    stage('Get the image hash') {
      steps{
        git branch: 'main', credentialsId: 'ana-git-userpass', url: 'https://github.com/patanna/ana-simple-nodejs-server-manifests.git'
        echo "Image hash is: ${GIT_BRANCH}_${GIT_COMMIT}"
        sh "sed -i 's/newTag:.*/newTag: ${GIT_BRANCH}_${GIT_COMMIT}/' kustomize.yaml"
        sh '''
            git config user.name "Jenkins"
            git config user.email "jenkins@example.com"
            git add .
            git commit -m "Automated commit by Jenkins"
            '''
        withCredentials([usernamePassword(credentialsId: 'ana-git-userpass', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
          sh '''
              git remote set-url origin https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/patanna/ana-simple-nodejs-server-manifests.git
              git push origin main
              '''
        }
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