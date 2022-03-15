
Push-Location "$PSScriptRoot"

$fullImageName = 'dekreydotnet.azurecr.io/ttrpgclocks'
$tag = (Get-Date).ToString('yyyy-MM-ddTHH_mm_ss')

cd ttrpg-clock-ui
# Functions are deployed to azure via Visual Studio
docker build . -t $fullImageName:$tag

az acr login --name dekreydotnet
docker push $fullImageName:$tag

Pop-Location


$ns = 'ttrpg-clocks'
$name = 'main'
$domain = 'clocks.dekrey.net'

helm upgrade --install -n $ns $name --create-namespace mdekrey/single-container `
     --set-string "image.repository=$($fullImageName)" `
     --set-string "image.tag=$tag" `
     --set-string "ingress.annotations.cert-manager\.io/cluster-issuer=letsencrypt" `
     --set-string "ingress.hosts[0].host=$domain"
