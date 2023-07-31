import { Credential } from 'ethereum-deposit';

const mnemonic = 'rhythm degree square hunt report anxiety weapon siege assist toddler provide modify captain heart initial';
const index = 0;
const chain = 'mainnet';
const amount = 32 * 1e9;
const withdrawalAddressHex = '0x849a5C52e1CA4AB0407E5BE3030cC420E7222F13';

const credential = new Credential(mnemonic, index, chain, amount, withdrawalAddressHex);

console.log(credential.depositDataJson);