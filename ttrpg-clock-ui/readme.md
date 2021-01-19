# To run locally

You'll need NodeJS. Make sure your functions project is running locally.

    npm install
    npm start

# To update in Kubernetes

Use something like the following. These instructions are intended for my use only, as I don't expect anyone will want to host it themselves within Kubernetes.

    docker build . -t dekreydotnet.azurecr.io/ttrpgclocks
    az acr login --name dekreydotnet
    docker push dekreydotnet.azurecr.io/ttrpgclocks:latest
    kubectl -n ttrpg-clocks set image deployment ttrpg-clocks-deployment web=$(docker inspect --format='{{index .RepoDigests 0}}' dekreydotnet.azurecr.io/ttrpgclocks:latest)
