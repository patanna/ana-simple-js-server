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

  environment {
    ArgoApp = 'ANA-SIMPLE-NODE-JS'
    ARGOCD_SERVER = '10.131.1.231:32766'
  }

  stages {
    stage('Checkout Code') {
            steps {
              git branch: 'main', credentialsId: 'ana-git-userpass', url: 'https://github.com/patanna/ana-simple-js-server.git'
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
        sh "sed -i 's/newTag:.*/newTag: ${GIT_BRANCH}_${GIT_COMMIT}/' kustomization.yaml"
        withCredentials([usernamePassword(credentialsId: 'ana-git-userpass', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
          script {
              def commitStatus = sh(script: """
                  git config user.name "Jenkins"
                  git config user.email "jenkins@example.com"
                  git add .
                  git commit -m "Automated commit by Jenkins"
                  git push"
              """, returnStatus: true)

              if (commitStatus != 0) {
                  echo "Nothing to commit, working tree clean"
              } else {
                  echo "Changes committed successfully"
              }
          }
        }
      }
    }

    stage('Deploy with ArgoCD') {
      steps{
        withCredentials([string(credentialsId: 'argoCD-jwt', variable: 'ARGOCD_AUTH_TOKEN')]) {
          sh '''
              export ARGOCD_SERVER=${ARGOCD_SERVER}
              curl --insecure -o ./argocd https://${ARGOCD_SERVER}/download/argocd-linux-amd64
              chmod +x ./argocd
              ./argocd app sync ${ArgoApp} --insecure
              ./argocd app wait ${ArgoApp} --insecure
              '''
          echo "Deployed with ArgoCD"
      }
    }
  }
  }
}