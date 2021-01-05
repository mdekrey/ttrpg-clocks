# To publish

    docker build . -t dekreydotnet.azurecr.io/ttrpgclocks
    az acr login --name dekreydotnet
    docker push dekreydotnet.azurecr.io/ttrpgclocks:latest
    kubectl -n ttrpg-clocks set image deployment ttrpg-clocks-deployment web=$(docker inspect --format='{{index .RepoDigests 0}}' dekreydotnet.azurecr.io/ttrpgclocks:latest)
