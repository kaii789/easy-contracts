# BlocX-Tech

This is the technical repository for BlocX. The primary Team Repository can be found [here](https://github.com/dcsil/BlocX).

Table of Contents
---
- [High-Level Architecture](#high-level-architecture)
- [Use Cases](#use-cases)

## High-Level Architecture

<img src="./images/architecture-diagram.png" width=800/>

### Client

The client is primarily based on the React framework.

[Solana Wallet Adaptor](https://github.com/solana-labs/wallet-adapter) is used to handle the connections with third-party crypto wallets (we aim to at least support [Phantom](https://phantom.app)).

The [Anchor framework](https://github.com/project-serum/anchor)'s [TypeScript client library](https://project-serum.github.io/anchor/ts/index.html) is used to generate TypeScript components based on the [IDL](https://en.wikipedia.org/wiki/Interface_description_language) of the main program (written in Rust) on the Solana Network. 

### Solana Network

The Anchor framework is used to generate Rust primitives for the main program.

The main Solana [program](https://docs.solana.com/developing/programming-model/accounts#executable) owns and behaves as an executor for existing active contracts.

Non-executable [accounts](https://docs.solana.com/developing/programming-model/accounts) are created ad hoc to store the current state of active contracts.

### Server

Express server used to serve the static React client.

Also acts as a gateway between the client and the Solana network for requesting read-only information, keeping the client as lightweight as possible.

### Data Store

MongoDB is used to cache server requests.

### Communication

The client communicates directly with the Solana network for write-requests via the [Solana JavaScript API](https://docs.solana.com/developing/clients/javascript-api). Examples include creating new non-executable accounts for new contracts ([ownership](https://docs.solana.com/developing/programming-model/accounts#ownership-and-assignment-to-programs) is immediately transferred to the Contract Executor program), or instructing the Contract Executor to progress an active contract, etc.

For read-requests, the client communicates with the Express server with REST APIs via HTTPS; the Express server in turn queries the Solana network using the Solana JavaScript API.


## Use Cases

We have currently devised 5 use cases to get the ball rolling. Please check out [this wireframe prototype](https://www.figma.com/proto/6UGCX0uzGVNU2gpPKYEhez/MVP-UX-Sketch?node-id=1%3A2&scaling=scale-down&page-id=0%3A1&starting-point-node-id=1%3A2) for a more comprehensive walkthrough.

### Use Case 1: As a contract owner, I can create digital financial contracts

This use case describes users who wish to use our tool to create smart contract for various financial agreements. Using our React frontend, users would set up contracts with financial conditions. Once finalized and signed by the user, our React client would create a non-executable account for the new contract on the Solana blockchain. We might also store the new contract or any other details in our mongoDB data store, as a way of caching what's on the blockchain.

<img src="./images/use_case_1.png" height=400/>

### Use Case 2: As a contract owner, I can create temporary escrow accounts and associate them with new contracts

One of the most valuable features that we've identified for financial contracts is escrow accounts. This use case enables our users to harness the capabilities of escrow accounts and incorporate them into their contracts as they're building them in our React client. More specifically, all contracts will automatically have an associated account.

<img src="./images/use_case_2.png" height=400/>

### Use Case 3: As a contract owner, I can define contracts with multiple logical statements that act on conditionals

This use case gives our users the ability to customize and accurately define their expectations in the contract, while staying within categories and functionality we've pre-defined. Our React client fetches the possible conditions, consequents, and alternatives, and presents them for our users to select and combine. Users can create as many statements as they wish, although our React client may run some concurrent error-checking to disuade conflicting statements.

<img src="./images/use_case_3.png" height=400/>

### Use Case 4: As a contract participant, I can search active contracts by their contract ID

This use case is rather simple. Users may have multiple contracts occuring at the same time, so we wish to provide our users the ability to see their existing contracts' details on our React client. Our React client may fetch once all the user's contracts from our Express backend, potentially making use of our data store if needed, and then filter out the needed contract ID during a query. Alternatively, for users with too many contracts, we would send a query to our Express backend for any contract ID search. 

<img src="./images/use_case_4.png" height=400/>

### Use Case 5: As a contract participant, I can view the contracts I have participated in

This use case enables our users to see their contracts in our React client, for bookkeeping or other similar purposes. We would likely cache user contracts on the blockchain in our data store, which our Express backend would fetch and pass to our React client for our users to see. Only thing to note, though, is that the Solana blockchain deletes inactive/expired smart contracts, which means seeing past contracts will likely not be a decentralized operation (i.e. the displayed inactive contracts cannot be fully trusted as blockchain-backed).

<img src="./images/use_case_5.png" height=400/>
