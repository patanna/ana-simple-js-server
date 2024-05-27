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

    environment {
      ArgoApp = 'ANA-SIMPLE-NODE-JS'
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
        withCredentials([usernamePassword(credentialsId: 'argoCD-jwt', passwordVariable: 'ARGOCD_AUTH_TOKEN')]) {
          sh '''
              export ARGOCD_SERVER=https://10.131.1.231:32766
              curl -sSL -o /usr/local/bin/argocd https://${ARGOCD_SERVER}/download/argocd-linux-amd64
              argocd app sync ${ArgoApp} 
              argocd app wait ${ArgoApp}
              '''
          echo "Deployed with ArgoCD"
      }
    }
  }
}