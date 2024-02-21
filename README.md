# Research
Hi there! This is the repo where all members will share important knowledge they found for the project

# Table of Content
- [What is Blockchain?](#what-is-blockchain)
- [So...How Does Blockchain Work?](#sohow-does-blockchain-work-)
  - [Cryptography (or usually called Hashing)](#cryptography-or-usually-called-hashing)
  - [Blocks and Mining?](#blocks-and-mining)
    - [Blocks](#blocks)
    - [Mining](#mining)
  - [BlockCHAIN](#blockchain)
  - [Distributed Blockchain](#distributed-blockchain)
  - [Let's make it even more secure: Signature](#lets-make-it-even-more-secure-signature)

# What is Blockchain?
Imagine a blockchain as a digital ledger or record book with these features:
  - **Decentralization**: This notebook isn't owned by one person or organization. Instead, it's spread out across many computers, called nodes, all around the world. Each node has its own copy of the blockchain.
  - **Consensus**: To add a new block to the chain, most of the nodes in the network must agree that it's valid. This agreement process is called "consensus." It helps ensure that all the copies of the blockchain are the same and that no one can cheat the system.
  - **Immutability**: Once something is written in the blockchain, it's really hard to change. This is because altering one block would require changing all the blocks after it, across all the copies of the blockchain on all the nodes. So, the blockchain is considered immutable.

# So...How Does Blockchain Work?
Video (https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=3678s) 01:05:32 - 01:22:56 

Website https://andersbrownworth.com/blockchain/

## Cryptography (or usually called Hashing)
https://andersbrownworth.com/blockchain/hash

ASU course that teaches this concept: CSE 365

Hashing means: given any input, the hashing program will do some _magic_ and produce an output that is:
  1. **Unique**: Inputs like "Binh", "Computer", "Blockchain" should produce 3 totally different outputs. Also, _relatively similar_ input should produce _completely different_ output. For example, "Arizona" can be hashed into "bbbb", "Arizzona" can be "abca", and "Arizonaaaa" can be "1234"
  2. **Fixed Length**: Like the "Arizona" example above, although the input length can vary, they will always result in a 4-digit length hash.
  3. **Irreversible**: Let's use the "Arizona" example. When given "bbbb", there is _technically_ no algorithm that can reverse that back to "Arizona". In other words, there is no way to convert a hashed text to human-readable text.

## Blocks and Mining?
### Blocks
https://andersbrownworth.com/blockchain/block

A Block has:
  1. Block number
  2. Nonce
  3. Data

All of which will be **Combined** and then **Hashed** to produce an output

### Mining
The mining algorithm will differ based on the type of blockchain system that you are using. However, the concept is that the algorithm will try to find the **Nonce** until we reach a desired result in the Hash Output

In the video example, the mining algorithm will bruteforce the Nonce until the hashed output starts with four 0s (0000...)

![image](https://github.com/Honeywell-UAM-Data-Management/research/assets/67848975/b43c7cfa-2211-4fcf-a3da-a4048ad7fe59)
![image](https://github.com/Honeywell-UAM-Data-Management/research/assets/67848975/2e1f69c6-8fca-4d47-9b31-9fe59690bb37)

## BlockCHAIN!
https://andersbrownworth.com/blockchain/blockchain

Remember we have 3 elements in a block? Now, we add the 4th element, which is **Prev**.

Prev refers to the hashed output of its _previous_ block in the blockchain. 

The first block in the blockchain will have Prev set to 00000...

### This is why Blockchain is Immutable!!!
Say if you change the data in block 2, the hash in block 2 changes
  - Which makes the Prev in block 3 wrong and requires re-mining
  - Which makes the Prev in block 4 wrong and requires re-mining
  - And so on...

## Distributed Blockchain
https://andersbrownworth.com/blockchain/distributed

### The Decentralization and Consensus of a blockchain. 

In a blockchain network, there are multiple peers with the exact same copy of the blockchain. If a peer decides to change a block, all of the other peers need to agree on that change and change their blocks accordingly. This is called **Consensus**. 

Also, if there is a mismatch in the blockchain among the peers, the majority wins! Therefore, no peer owns the blockchain network. Everything here is **Decentralized**

## Let's make it even more secure: Signature
https://andersbrownworth.com/blockchain/public-private-keys/signatures

Say we have a blockchain network that stores the transaction history, how can we make sure that Jane actually sent John $25? What stops Jane from faking it and telling the other peers to update their blockchain?

This is where **signature** comes into place. Alex will be the one who "signs" this transaction for us. Here's how it works:
  1. Alex has a Private key (which he keeps it for himself) and Public key (which everyone gets access to)
  2. Alex hashes the transaction with his Private key and produces an output, say "xyz1"
  3. Anyone can just use Alex's Public key and input "xyz1" with Jane's transaction. This Public key will help people figure out if Alex actually signed this.

Jane cannot fake this transaction since only Alex has his Private key

