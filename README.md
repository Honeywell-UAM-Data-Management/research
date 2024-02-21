# Research
Hi there! This is the repo where all members will share important knowledge they found for the project

# Table of Content
- [So...How Does Blockchain Work?](#sohow-does-blockchain-work-)
  - [Cryptography (or usually called Hashing)](#cryptography-or-usually-called-hashing)
  - [Blocks?](#blocks)

# So...How Does Blockchain Work?
Video (https://www.youtube.com/watch?v=gyMwXuJrbJQ&t=3678s) 01:05:32 - 01:22:56 
Website https://andersbrownworth.com/blockchain/

## Cryptography (or usually called Hashing)
ASU course that teaches this concept: CSE 365

Hashing means: given any input, the hashing program will do some _magic_ and produce an output that is:
  1. **Unique**: Inputs like "Binh", "Computer", "Blockchain" should produce 3 totally different outputs. Also, _relatively similar_ input should produce _completely different_ output. For example, "Arizona" can be hashed into "bbbb", "Arizzona" can be "abca", and "Arizonaaaa" can be "1234"
  2. **Fixed Length**: Like the "Arizona" example above, although the input length can vary, they will always result in a 4-digit length hash.
  3. **Irreversible**: Let's use the "Arizona" example. When given "bbbb", there is _technically_ no algorithm that can reverse that back to "Arizona". In other words, there is no way to convert a hashed text to human-readable text.

## Blocks?
A Block has:
  1. Block number
  2. Nonce
  3. Data

All of which will be **combined** and then **hashed** to produce an output
