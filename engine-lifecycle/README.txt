Navigate to Fabric/fabric-samples

cd engine-lifecycle
Navigate to Fabric/fabric-samples/engine-lifecycle
Copy both folders from github into this directory (application-javascript, chaincode-javascript)

Navigate to Fabric/fabric-samples/test-network

./network.sh down
./network.sh up createChannel -ca

./network.sh deployCC -ccn engine-lifecycle -ccp ../engine-lifecycle/chaincode-javascript/ -ccl javascript

Navigate to Fabric/fabric-samples/engine-lifecycle/application-javascript

node app.js
(If there is an error regarding the wallet, delete the wallet folder in application-javascript and rerun "node app.js")
