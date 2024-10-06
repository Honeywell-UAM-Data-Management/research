'use strict';

const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class EngineLifecycle extends Contract {

    async InitLedger(ctx) {
        const engines = [
            {
                ID: 'engine1',
                Make: 'Rolls Royce',
                Model: 'Trent 1000',
                Age: 2,
                Condition: 'Operational',
                Owner: 'AirlineA',
                Services: []
            },
            {
                ID: 'engine2',
                Make: 'GE Aviation',
                Model: 'GE90',
                Age: 5,
                Condition: 'Operational',
                Owner: 'AirlineB',
                Services: []
            }
        ];

        for (const engine of engines) {
            engine.docType = 'engine';
            await ctx.stub.putState(engine.ID, Buffer.from(stringify(sortKeysRecursive(engine))));
        }
    }

    // CreateEngine issues a new engine to the world state with given details.
    async CreateEngine(ctx, id, make, model, age, condition, owner) {
        const exists = await this.EngineExists(ctx, id);
        if (exists) {
            throw new Error(`The engine ${id} already exists`);
        }

        const engine = {
            ID: id,
            Make: make,
            Model: model,
            Age: age,
            Condition: condition,
            Owner: owner,
            Services: []  // New engines start with no service history
        };
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(engine))));
        return JSON.stringify(engine);
    }

    // ReadEngine returns the engine stored in the world state with given id.
    async ReadEngine(ctx, id) {
        const engineJSON = await ctx.stub.getState(id);
        if (!engineJSON || engineJSON.length === 0) {
            throw new Error(`The engine ${id} does not exist`);
        }
        return engineJSON.toString();
    }

    // UpdateEngine updates an existing engine's details in the world state.
    async UpdateEngine(ctx, id, make, model, age, condition, owner) {
        const exists = await this.EngineExists(ctx, id);
        if (!exists) {
            throw new Error(`The engine ${id} does not exist`);
        }

        const updatedEngine = {
            ID: id,
            Make: make,
            Model: model,
            Age: age,
            Condition: condition,
            Owner: owner,
            Services: []  // This would keep previous services if needed
        };
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedEngine))));
    }

    // DeleteEngine deletes a given engine from the world state.
    async DeleteEngine(ctx, id) {
        const exists = await this.EngineExists(ctx, id);
        if (!exists) {
            throw new Error(`The engine ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // EngineExists returns true when engine with given ID exists in world state.
    async EngineExists(ctx, id) {
        const engineJSON = await ctx.stub.getState(id);
        return engineJSON && engineJSON.length > 0;
    }

    // TransferEngineOwnership updates the owner field of an engine with the given id in the world state.
    async TransferEngineOwnership(ctx, id, newOwner) {
        const engineString = await this.ReadEngine(ctx, id);
        const engine = JSON.parse(engineString);
        const oldOwner = engine.Owner;
        engine.Owner = newOwner;
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(engine))));
        return oldOwner;
    }

    // AddServiceRecord adds a new service record to the engine's service history.
    async AddServiceRecord(ctx, id, serviceDetails) {
        const engineString = await this.ReadEngine(ctx, id);
        const engine = JSON.parse(engineString);

        engine.Services.push(serviceDetails);
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(engine))));

        return JSON.stringify(engine);
    }

    // GetAllEngines returns all engines found in the world state.
    async GetAllEngines(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}

module.exports = EngineLifecycle;
