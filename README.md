<<<<<<< HEAD
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
- [Hyperledger Fabric](#hyperledger-fabric)
- [Keywords](#keywords)
  
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

# Hyperledger Fabric
https://hyperledger-fabric.readthedocs.io/en/latest/whatis.html

## Why Hyperledger Fabric
Since the project is for enterprise use, we need to consider the following requirements:
- Participants must be identified/identifiable:
  - the participants are known to each other rather than anonymous and, therefore, fully untrusted. This means that while the participants may not fully trust one another (they may, for example, be competitors in the same industry), a network can be operated under a governance model that is built off of what trust does exist between participants, such as a legal agreement or framework for handling disputes.
- Networks need to be permissioned
  - Hyperledger Fabric achieves this by utilizing **Channels**
- High transaction throughput performance
- Low latency of transaction confirmation
- Privacy and confidentiality of transactions and data pertaining to business transactions
  - In channels, participants on a Fabric network establish a sub-network where every member has visibility to a particular set of transactions. Thus, only those nodes that participate in a channel have access to the smart contract (chaincode) and data transacted, preserving the privacy and confidentiality of both. Private data allows collections between members on a channel, allowing much of the same protection as channels without the maintenance overhead of creating and maintaining a separate channel.



# Keywords
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 82b5650 (Initial commit from Create Next App)
