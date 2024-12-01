'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const app = express();
const port = 4000;

const channelName = 'mychannel';
const chaincodeName = 'engine-lifecycle';

const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'javascriptAppUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Helper function for blockchain gateway
async function getContract() {
	try {
		const ccp = buildCCPOrg1();
		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
		const wallet = await buildWallet(Wallets, walletPath);

		await enrollAdmin(caClient, wallet, mspOrg1);
		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

		const gateway = new Gateway();

		await gateway.connect(ccp, {
			wallet,
			identity: org1UserId,
			discovery: { enabled: true, asLocalhost: true }
		});

		const network = await gateway.getNetwork(channelName);
		const contract = network.getContract(chaincodeName);

		// console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of engines on the ledger');
		// await contract.submitTransaction('InitLedger');
		// console.log('*** Result: committed');
	
		return { contract: network.getContract(chaincodeName), gateway };
	}
	catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
		process.exit(1);
	}
    
}

// API Endpoints
app.get('/api/engines', async (req, res) => {
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('GetAllEngines');
        res.json(JSON.parse(result.toString()));
        gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/engines/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { contract, gateway } = await getContract();
        const result = await contract.evaluateTransaction('ReadEngine', id);
        res.json(JSON.parse(result.toString()));
        gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/engines', async (req, res) => {
    const { id, make, model, age, condition, owner } = req.body;
    try {
        const { contract, gateway } = await getContract();
        await contract.submitTransaction('CreateEngine', id, make, model, age, condition, owner);
        res.json({ success: true, message: 'Engine created successfully.' });
        gateway.disconnect();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Fabric API server is running at http://localhost:${port}`);
});


// The following commented code is a basic application that runs in the command line. It simply tests methods within the chaincode. It is useful to reference to understand how chaincode methods are called.


// 'use strict';

// const { Gateway, Wallets } = require('fabric-network');
// const FabricCAServices = require('fabric-ca-client');
// const path = require('path');
// const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
// const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

// const channelName = process.env.CHANNEL_NAME || 'mychannel';
// const chaincodeName = process.env.CHAINCODE_NAME || 'engine-lifecycle';  // Updated for engine lifecycle chaincode

// const mspOrg1 = 'Org1MSP';
// const walletPath = path.join(__dirname, 'wallet');
// const org1UserId = 'javascriptAppUser';

// function prettyJSONString(inputString) {
// 	return JSON.stringify(JSON.parse(inputString), null, 2);
// }

// async function main() {
// 	try {
// 		const ccp = buildCCPOrg1();
// 		const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
// 		const wallet = await buildWallet(Wallets, walletPath);

// 		await enrollAdmin(caClient, wallet, mspOrg1);
// 		await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

// 		const gateway = new Gateway();

// 		try {
// 			await gateway.connect(ccp, {
// 				wallet,
// 				identity: org1UserId,
// 				discovery: { enabled: true, asLocalhost: true }
// 			});

// 			const network = await gateway.getNetwork(channelName);
// 			const contract = network.getContract(chaincodeName);

// 			// Initialize a set of engine data on the channel using the chaincode 'InitLedger' function.
// 			console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of engines on the ledger');
// 			await contract.submitTransaction('InitLedger');
// 			console.log('*** Result: committed');

// 			// Query all engines on the ledger.
// 			console.log('\n--> Evaluate Transaction: GetAllEngines, function returns all the current engines on the ledger');
// 			let result = await contract.evaluateTransaction('GetAllEngines');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Submit a transaction to create a new engine.
// 			console.log('\n--> Submit Transaction: CreateEngine, creates a new engine with ID, make, model, age, condition, and owner');
// 			result = await contract.submitTransaction('CreateEngine', 'engine313', 'GE Aviation', 'GE90', '3', 'Operational', 'AirlineX');
// 			console.log('*** Result: committed');
// 			if (`${result}` !== '') {
// 				console.log(`*** Result: ${prettyJSONString(result.toString())}`);
// 			}

// 			// Query a specific engine by its ID.
// 			console.log('\n--> Evaluate Transaction: ReadEngine, function returns an engine with a given engineID');
// 			result = await contract.evaluateTransaction('ReadEngine', 'engine313');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Check if an engine exists by its ID.
// 			console.log('\n--> Evaluate Transaction: EngineExists, function returns "true" if an engine with given engineID exists');
// 			result = await contract.evaluateTransaction('EngineExists', 'engine1');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Update engine condition.
// 			console.log('\n--> Submit Transaction: UpdateEngine engine1, change the condition to "Under Maintenance"');
// 			await contract.submitTransaction('UpdateEngine', 'engine1', 'Rolls Royce', 'Trent 1000', '2', 'Under Maintenance', 'AirlineA');
// 			console.log('*** Result: committed');

// 			// Read updated engine data.
// 			console.log('\n--> Evaluate Transaction: ReadEngine, function returns "engine1" attributes');
// 			result = await contract.evaluateTransaction('ReadEngine', 'engine1');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Add a new service record to the engine.
// 			console.log('\n--> Submit Transaction: AddServiceRecord engine1, add a service record');
// 			await contract.submitTransaction('AddServiceRecord', 'engine1', 'Routine maintenance on 2024-10-05');
// 			console.log('*** Result: committed');

// 			// Read updated engine data with service record.
// 			console.log('\n--> Evaluate Transaction: ReadEngine, function returns "engine1" with service history');
// 			result = await contract.evaluateTransaction('ReadEngine', 'engine1');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// Transfer ownership of the engine.
// 			console.log('\n--> Submit Transaction: TransferEngineOwnership engine1, transfer to new owner AirlineY');
// 			await contract.submitTransaction('TransferEngineOwnership', 'engine1', 'AirlineY');
// 			console.log('*** Result: committed');

// 			// Read updated engine data after ownership transfer.
// 			console.log('\n--> Evaluate Transaction: ReadEngine, function returns "engine1" attributes after ownership transfer');
// 			result = await contract.evaluateTransaction('ReadEngine', 'engine1');
// 			console.log(`*** Result: ${prettyJSONString(result.toString())}`);	

// 		} finally {
// 			gateway.disconnect();
// 		}
// 	} catch (error) {
// 		console.error(`******** FAILED to run the application: ${error}`);
// 		process.exit(1);
// 	}
// }

// main();
