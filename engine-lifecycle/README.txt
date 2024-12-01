YouTube video tutorial: https://www.youtube.com/watch?v=vqLV9Iv0d-w

1. Install Hyperledger Fabric and associated software by following the documentation:

https://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html

2. Navigate to Fabric/fabric-samples

mkdir engine-lifecycle
Navigate to Fabric/fabric-samples/engine-lifecycle
Copy both folders from github into this directory (application-javascript, chaincode-javascript)

3. Bring up the blockchain network and expose the local API endpoints. Navigate to Fabric/fabric-samples/test-network.

./network.sh down
./network.sh up createChannel -ca
./network.sh deployCC -ccn engine-lifecycle -ccp ../engine-lifecycle/chaincode-javascript/ -ccl javascript
(If there is an issue with bringing up the network or deploying the chaincode, the issue is likely with the Docker version. Make sure to update your Docker Desktop to the latest version)

Navigate to Fabric/fabric-samples/engine-lifecycle/application-javascript

node app.js
(If there is an error regarding the wallet, delete the wallet folder in application-javascript and rerun "node app.js")

(These commands will bring up the blockchain network, deploy the chaincode on the network, and run the application which creates API endpoints to interact with the network)
(Go to http://localhost:4000/api/engines to test whether all engines on the network are being properly displayed

4. Run the UI application to display the results of the blockchain. Navigate to Fabric/fabric-samples/engine-lifecycle/uam-display-app

npm run dev
(If there are errors check to make sure you have the correct version and dependencies installed. Common fixes include running npm install, nvm install 18, npm install lucide-react@latest, or npm install @swc/helpers)
Open http://localhost:3000/ and refresh the page everytime there is an update to the blockchain. When this is first loaded, there will not be any entries. You must manually edit the blockchain ledger via the CLI.

5. Interact with the blockchain through the CLI. Navigate to Fabric/fabric-samples/test-network and run the following commands to operate the peer CLI as an Org1 admin on the blockchain netowrk.

export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
peer version
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID=Org1MSP
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051

peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n engine-lifecycle --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

peer chaincode query -C mychannel -n engine-lifecycle -c '{"Args":["GetAllEngines"]}'

(The last two commands should initialize the blockchain ledger with two entries and print the current contents of the blockchain. After running them, the UAM display application on localhost:3000 can be refreshed and it will contain the new updates. You can further interact with the network by running the peer chaincode invoke command above
and changing the "function" and "Args" values. For example, in order to create a new engine in the blockchain, run the following command and MAKE SURE to use double quotes for string parameters:
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n engine-lifecycle --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"CreateEngine","Args":["engine313", "GE Aviation", "GE90", "3", "Operational", "AirlineX"]}')
