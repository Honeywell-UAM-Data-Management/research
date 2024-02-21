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

# What is Blockchain?
Imagine a blockchain as a digital ledger or record book with these nature:
  - Decentralization: This notebook isn't owned by one person or organization. Instead, it's spread out across many computers, called nodes, all around the world. Each node has its own copy of the blockchain.
  - Consensus: To add a new block to the chain, most of the nodes in the network must agree that it's valid. This agreement process is called "consensus." It helps ensure that all the copies of the blockchain are the same and that no one can cheat the system.
  - Immutability: Once something is written in the blockchain, it's really hard to change. This is because altering one block would require changing all the blocks after it, across all the copies of the blockchain on all the nodes. So, the blockchain is considered immutable.

# So...How Does Blockchain Work?
Video (https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=3678s) 01:05:32 - 01:22:56 
Website https://andersbrownworth.com/blockchain/

## Cryptography (or usually called Hashing)
ASU course that teaches this concept: CSE 365

Hashing means: given any input, the hashing program will do some _magic_ and produce an output that is:
  1. **Unique**: Inputs like "Binh", "Computer", "Blockchain" should produce 3 totally different outputs. Also, _relatively similar_ input should produce _completely different_ output. For example, "Arizona" can be hashed into "bbbb", "Arizzona" can be "abca", and "Arizonaaaa" can be "1234"
  2. **Fixed Length**: Like the "Arizona" example above, although the input length can vary, they will always result in a 4-digit length hash.
  3. **Irreversible**: Let's use the "Arizona" example. When given "bbbb", there is _technically_ no algorithm that can reverse that back to "Arizona". In other words, there is no way to convert a hashed text to human-readable text.

## Blocks and Mining?
### Blocks
A Block has:
  1. Block number
  2. Nonce
  3. Data

All of which will be **Combined** and then **Hashed** to produce an output

### Mining
The mining algorithm will differ based on the type of blockchain system that you are using. However, the concept is that the algorithm will bruteforce the **Nonce** until we reach a desired result in the Hash Output

In the video example, the mining algorithm will bruteforce the Nonce until the hashed output starts with four 0s (0000...)

![image](https://github.com/Honeywell-UAM-Data-Management/research/assets/67848975/b43c7cfa-2211-4fcf-a3da-a4048ad7fe59)
![image](https://github.com/Honeywell-UAM-Data-Management/research/assets/67848975/2e1f69c6-8fca-4d47-9b31-9fe59690bb37)

## BlockCHAIN!
Remember we have 3 elements in a block? Now, we add the 4th element, which is **Prev**.
Prev refers to the hashed output of its _previous_ block in the blockchain. 
The first block in the blockchain will have Prev set to 00000...

### This is why Blockchain is Immutable!!!
Say if you change the data in block 2, the hash in block 2 changes
  - Which makes the Prev in block 3 wrong and requires re-mining
  - Which makes the Prev in block 4 wrong and requires re-mining
  - And so on...
