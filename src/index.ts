/* IMPORTANT: PLEASE OPEN THE README.MD FILE IN THIS PROJECT FOLDER FIRST BEFORE TOUCHING THIS CODE DOWN BELOW. THANK YOU !! */

// DON'T CHANGE
import { providers, Wallet, BigNumber } from 'ethers';
import { FlashbotsBundleProvider, FlashbotsBundleResolution } from '@flashbots/ethers-provider-bundle';
import { fromWei } from 'web3-utils';
import * as dotenv from 'dotenv'
dotenv.config()

const GWEI = BigNumber.from(10).pow(9); // DON'T CHANGE
const PRIORITY_FEE = GWEI.mul(17); // Choose the GWEI number with highest priority from the following link https://etherscan.io/gastracker. (example: 17)
const BLOCKS_IN_THE_FUTURE = 1; // DON'T CHANGE

// DON'T CHANGE
const FLASHBOTS_ENDPOINT = 'https://relay.flashbots.net';
const CHAIN_ID = 137;

// DON'T CHANGE
const convertWeiToEth = (wei: BigNumber): string => {
  return fromWei(wei.toString(), 'ether');
};

// DON'T CHANGE
const convertWeiToGwei = (wei: BigNumber): string => {
  return fromWei(wei.toString(), 'gwei');
};

// DON'T CHANGE
const INFURA_KEY = process.env.INFURA_KEY;

// DON'T CHANGE
const SUPPORT_WALLET_PRIVATE_KEY = process.env.SUPPORT_WALLET_PRIVATE_KEY;

// DON'T CHANGE
const COMPROMISED_WALLET_PRIVATE_KEY = process.env.COMPROMISED_WALLET_PRIVATE_KEY;

if (!(INFURA_KEY || SUPPORT_WALLET_PRIVATE_KEY || SUPPORT_WALLET_PRIVATE_KEY)) {
  console.log('Please include INFURA_KEY, SUPPORT_WALLET_PRIVATE_KEY, and COMPROMISED_WALLET_PRIVATE_KEY as env variables.');
  process.exit(1);
}

// DON'T CHANGE
const SEND_BUNDLE: string = process.env.SEND_BUNDLE;
if (SEND_BUNDLE === 'true') {
  console.log('Sending bundle');
} else {
  console.log('Running only simulation, please set SEND_BUNDLE=true to send bundle');
}

// DON'T CHANGE
const provider = new providers.InfuraProvider(CHAIN_ID, INFURA_KEY); // Fill in your Infura API key in the .env file
const fundingWallet = new Wallet(SUPPORT_WALLET_PRIVATE_KEY, provider); // Fill in your support private key in the .env file
const compromisedWallet = new Wallet(COMPROMISED_WALLET_PRIVATE_KEY, provider); // Fill in your compromised private key in the .env file

// DON'T CHANGE
const tx = (args) => ({
  chainId: CHAIN_ID,
  type: 2,
  maxPriorityFeePerGas: PRIORITY_FEE,
  data: '0x',
  value: 0n,
  ...args,
});

// DON'T CHANGE
const getBundle = (maxBaseFeeInNextBlock: BigNumber) => {

  const maxFeePerGas: BigNumber = PRIORITY_FEE.add(maxBaseFeeInNextBlock); // DON'T CHANGE

  const totalGasNeeded: BigNumber = BigNumber.from(FILL IN THE TOTAL GAS AMOUNT); // Paste the same gasLimit here you filled in at line 109 vice versa. They have to match.
  const fundAmount: BigNumber = maxFeePerGas.mul(totalGasNeeded); // DON'T CHANGE

  // DON'T CHANGE
  console.log(`Priority fee:\t\t${PRIORITY_FEE} WEI, ${convertWeiToGwei(PRIORITY_FEE)} GWEI
  Base fee:\t\t${maxBaseFeeInNextBlock} WEI, ${convertWeiToGwei(maxBaseFeeInNextBlock)} GWEI
  Max fee per gas:\t${maxFeePerGas} WEI, ${convertWeiToGwei(maxFeePerGas)} GWEI
  Fund amount:\t\t${fundAmount} WEI, ${convertWeiToGwei(fundAmount)} GWEI, ${convertWeiToEth(fundAmount)} ETH`);

  // DON'T CHANGE
  const bundle = [
    {
      transaction: tx({
        to: compromisedWallet.address,
        maxFeePerGas,
        gasLimit: 21000,
        value: fundAmount,
      }),
      signer: fundingWallet,
    },

    /* This is editable part of the code. Follow these steps to find the address of your specific NFT:
  
    1. Open the Etherscan of the NFT you want to transfer out of the compromised wallet (example: https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d)
    2. Paste '#writeContract' at the of the URL from Step 1 in your address bar (example: https://etherscan.io/address/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d#writeContract)
    3. Click on 'Connect with Web3' button and connect with MetaMask
    4. Scroll down until you see 'TransferFrom' and open it
    5. Now do as follows: 
      5.1 Fill in your compromised blockchain wallet address in the first field (example : 0xD76Bde6651939C6181C96219a3390B4FD7730812)
      5.2 Fill in your support blockchain wallet address in the second field (example : 0xM06Bde6651939C6181C96219a3390B4FD7730812)
      5.3 Fill in the tokenId of your specific NFT, it's under the 'Details' tab of your NFT (example: https://opensea.io/assets/ethereum/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/9771)
      5.4 Click the 'Write' button and click the 'HEX' tab when the MetaMask screen pops up. Copy the HEX code and paste . 

    */

    {
      transaction: tx({
        to: 'PASTE THE ETHEREUM ADDRESS OF THE NFT COLLECTION HERE',
        maxFeePerGas,
        gasLimit: PASTE THE TOTAL GAS AMOUNT, // Check README.md for information on how to estimate the gasLimit for your specific NFT (default: 65036)
        data: 'PASTE THE HEX OF YOUR SPECIFIC NFT HERE',
      }),
      signer: compromisedWallet,
    }
  ];
  return bundle;
};

// DON'T CHANGE
let attempt: number = 0;
async function main() {
  console.log('Starting flashbot...');

  // DON'T CHANGE
  let flashbotsProvider;
  try {
    console.log('Retreiving Flashbots Provider...');
    flashbotsProvider = await FlashbotsBundleProvider.create(provider, Wallet.createRandom(), FLASHBOTS_ENDPOINT);
  } catch (err) {
    console.error(err);
  }

  // DON'T CHANGE
  provider.on('block', async (blockNumber) => {
    const targetBlock = blockNumber + BLOCKS_IN_THE_FUTURE;
    console.log(`Attempt: ${attempt} - Preparing bundle for block: ${targetBlock}`);
    try {

      const block = await provider.getBlock(blockNumber);
      const maxBaseFeeInFutureBlock = FlashbotsBundleProvider.getMaxBaseFeeInFutureBlock(block.baseFeePerGas, BLOCKS_IN_THE_FUTURE);
      console.log(`Max base fee in block ${targetBlock} is ${maxBaseFeeInFutureBlock} WEI`);

      const signedBundle = await flashbotsProvider.signBundle(getBundle(maxBaseFeeInFutureBlock));

      console.log('Running simulation');
      const simulation = await flashbotsProvider.simulate(signedBundle, targetBlock);
      console.log(simulation)
      if ('error' in simulation) {
        console.warn(`Simulation Error: ${simulation.error.message}`);
        process.exit(1);
      } else {
        console.log(`Simulation Success: ${JSON.stringify(simulation, null, 2)}`);
        console.log(simulation);
      }

      if (SEND_BUNDLE) {

        console.log('Run bundle');
        const txBundle = await flashbotsProvider.sendRawBundle(signedBundle, targetBlock);
        if ('error' in txBundle) {
          console.error('Fatal error in bundle:', txBundle.error);
          process.exit(1);
        }

        const waitResponse = await txBundle.wait();
        console.log(`Wait Response: ${FlashbotsBundleResolution[waitResponse]}`);
        if (waitResponse === FlashbotsBundleResolution.BundleIncluded) {
          console.log(`Bundle included in block ${targetBlock}`, waitResponse);
          process.exit(0);
        } else if (waitResponse === FlashbotsBundleResolution.AccountNonceTooHigh) {
          console.log(`Nonce too high (block: ${targetBlock})`, waitResponse);
          process.exit(0);
        } else if (waitResponse === FlashbotsBundleResolution.BlockPassedWithoutInclusion) {
          console.log(`Not included in ${blockNumber}`, waitResponse);
        } else {
          console.log('Unexpected response obtained', waitResponse);
        }
      }
      attempt++;
    } catch (err) {
      console.error('Fatal request error', err);
      process.exit(1);
    }
  });
}

// DON'T CHANGE
main();
