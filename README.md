# NFT-Rescue-with-Flashbots
# HELP! I have been hacked by a sweeper bot.

First of all, 

We completely understand the situation you are in now. What happened? For some reason your MetaMask wallet has been compromised/hacked, and all your Ether (ETH) has been transferred to another account without any authorization. Out of panic, you have probably added crypto again to fund the transaction for the NFTs, but that got sweeped once it landed in your wallet. It's a hopeless situation right now. The Ether is gone.. BUT you still have the NFT(s) in your compromised wallet that are currently untouched!

This code is focused on helping people that have little to no experience with writing code. Why should you spend hours of your time to fix something you did not ask for in the first place, while the clock is ticking? The documentation of Flashbots is too complicated for beginners, and the quick start has only half the information to get your NFT(s) back as soon as possible. Also, we are aware that some people don't have the funds to pay a whitehacker for helping them out. No worries, we got you covered by giving all the code where you only have to change some information!  

We are going to use Flashbots for this.

## How do I get started?!

You have to search on the internet for the following things in order to execute the code, they are completely free:
- Visual Studio Code https://code.visualstudio.com/ (This the program to write and execute the code in)
- NodeJS https://nodejs.org/en/ (This is used with Visual Studio Code and will connect you with your blockchain address)

If you need some more guidance in how to get set up for both VS Code and NodeJS. These videos are helpful:
- https://www.youtube.com/watch?v=B-s71n0dHUk&ab_channel=VisualStudioCode (7 minutes)
- https://www.youtube.com/watch?v=sJ7nDNNpOMA&ab_channel=JamesQQuick (6 minutes)

## Create a new safe wallet with seed phrase

- In order to save your NFT(s) from the compromised wallet, they have to be transferred to a safe new MetaMask support wallet. 
- We recommend to do this in a different browser and/or after a virus scan. This is to make sure your new wallet with retrieved NFTs will not get compromised again. 
- Create a new MetaMask account with a wallet

IMPORTANT: Make sure there is enough ETH on your safe wallet to support the transaction of the NFT transfer!

When you are done, come back to this document for the next step.

## Create a Infura account for API key
In order to do the transaction your will need an Infura account. Go to the following link https://app.infura.io/register and create an API key when your are logged in. This is important for the next step that you can read down below. 

## Let's open the project and retrieve your NFT(s)

1. Open the folder where you found this document in with Visual Studio Code (File > Open Folder > select nft-rescuer-flashbots)
2. Open the terminal in Visual Studio Code (Ctrl + `)
3. Copy and paste the following line in the terminal: 

*npm install*. 

This will install all the dependencies you need to communicate with the blockchain.

Almost there with setting things up! Now we need to fill in some information in the **.env** file, first we will explain what these keys actually mean:

*INFURA_KEY*
This where you paste the API key you generated on your Infura account.

*COMPROMISED_WALLET_PRIVATE_KEY*
This where you paste your private key that is stored inside the compromised wallet. If you don't know where to find your private key, use the following link:
https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key

*SUPPORT_WALLET_PRIVATE_KEY*
This is where you paste your private key from the MetaMask support wallet (see title: 'Create a new safe wallet with seed phrase'). If you don't know where to find your private key, use the following link:
https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-export-an-account-s-private-key

*SEND_BUNDLE*
This will be the green light/start sign for your transaction of the NFT to the safe support wallet. By default it is on 'false', when you are ready to do the transaction put the value on 'true'! Keep it on 'false' for now while we set up the code for the transfer.

IMPORTANT: NEVER SHARE YOUR PRIVATE KEY OR SEED PHRASE WITH ANYONE
IMPORTANT: DON'T UPLOAD THE .ENV FILE WITH YOUR PRIVATE KEYS ANYWHERE

## Changing the variables of the code to match the NFT transaction

1. Open the file *index.ts* in your project
2. Right now the code is set to default values. Most of the code can remain untouched. However, the following needs to be changed:

1.1 const PRIORITY_FEE = GWEI.mul(PASTE THE GWEI NUMBER HERE); on line 11
1.2 const totalGasNeeded: BigNumber = BigNumber.from(FILL IN THE TOTAL GAS AMOUNT); on line 83
1.3 {
      transaction: tx({
        to: '**PASTE THE ETHEREUM ADDRESS OF THE WHOLE NFT PROJECT HERE**', (example: 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
        maxFeePerGas,
        gasLimit: '**PASTE THE SAME VALUE OF THE PRIORITY FEE FROM 1.2 HERE**', (default: 65036)
        data: '**PASTE THE HEX CODE OF THE SPECIFIC NFT HERE**',
      }),
      signer: compromisedWallet,
      }

## Estimate the gasLimit for of your NFT and pasting it in the code 

In order to make the transaction you need enough gas. To decide what gas value needs to be put in the code (index.ts), you need to look up the average gasLimit of the NFT on Etherscan you want to transfer. Do the following: 

Go to your NFT from the compromised wallet on Etherscan, and scroll down until you see the dropdown 'Click to see More' and copy the 'Gas Limit & Usage by Txn' value. Paste that value between the brackets at line 70 and for the gasLimit at line 109 in the file index.ts.

## Running the script

This is the last part, now we will do the actual transaction on the Ethereum blockchain main net to transfer the NFT to the safe wallet. Open your terminal (CTRL + `) and paste the following code:

*npm start*

Let the terminal run until the moment that it stops, this can take a while. Onced it stops that means your block is mined and the transaction is complete! The time it takes to mine depends on how high you have put the GWEI you selected from the https://etherscan.io/gastracker. This refers to the code on line 11 in index.ts. 

If everything went right without errors you should have the NFT in your safe wallet now. Congratulations!

# Useful sources
- Blogpost from SteveP - Compromised - https://steviep.xyz/txt/compromised
- Frontrunning a scammer from whitehat perspective - https://amanusk.medium.com/frontrunning-a-scammer-95f34dd33cf8
- Frontrunning a scammer from victims perspective - https://www.reddit.com/r/CryptoCurrency/comments/om7ecc/frontrunning_a_scammer_pov_from_the_whitehat/
