import { CredentialList } from "../credentials.ts";

const defaultMnemonic = 'rhythm degree square hunt report anxiety weapon siege assist toddler provide modify captain heart initial';
const defaultValidatorsCount = 1;
const defaultNetwork = 'mainnet';
const defaultAmount = 32 * 1e9;
const defaultWithdrawalAddressHex = "0x849a5C52e1CA4AB0407E5BE3030cC420E7222F13";

it("credential list returns a list of validator credentials", () => {
    const credentials = new CredentialList(defaultMnemonic, defaultValidatorsCount, defaultNetwork, defaultAmount, defaultWithdrawalAddressHex);
    console.log(credentials)
})
