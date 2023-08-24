import { CredentialList, Credential } from "../credentials.ts";
import { expect } from 'chai';
import { EthereumDepositData } from "../types.ts";
import { getChainSetting } from "../settings.ts";
import { MAX_DEPOSIT_AMOUNT, MIN_DEPOSIT_AMOUNT } from "../constants.ts";

const defaultMnemonic = 'rhythm degree square hunt report anxiety weapon siege assist toddler provide modify captain heart initial';
const defaultValidatorsCount = 2;
const defaultNetwork = 'mainnet';
const defaultAmount = 32 * 1e9;
const defaultWithdrawalAddressHex = "0x849a5C52e1CA4AB0407E5BE3030cC420E7222F13";
const defaultStartIndex = 0; // How many validators to skip before starting to generate credentials.

describe("Credential", () => {
    const credential = new Credential(
        defaultMnemonic,
        defaultStartIndex,
        defaultNetwork,
        defaultAmount,
        defaultWithdrawalAddressHex,
    );

    it("object is a validator credential", () => {
        expect(credential).instanceOf(Credential);
    });

    it("credential has correct chain settings", () => {
        const chainSetting = getChainSetting(defaultNetwork);
        expect(credential.chainSetting).to.deep.equal(chainSetting);
    });

    it("credential has correct withdrawal address set", () => {
        expect(credential.withdrawalAddressHex).to.equal(defaultWithdrawalAddressHex);
    });

    it("credential has correct amount", () => {
        expect(credential.amount).to.equal(defaultAmount);
    });

    it("credential does not allow invalid amount (< MIN_DEPOSIT_AMOUNT)", () => {
        const invalidCredential = new Credential(
            defaultMnemonic,
            defaultStartIndex,
            defaultNetwork,
            1,
            defaultWithdrawalAddressHex,
        );
        expect(invalidCredential.amount).to.be.lt(MIN_DEPOSIT_AMOUNT) && expect(() => invalidCredential.depositData).to.throw("Invalid deposit amount");
    });

    it("credential does not allow invalid amount (> MAX_DEPOSIT_AMOUNT)", () => {
        const invalidCredential = new Credential(
            defaultMnemonic,
            defaultStartIndex,
            defaultNetwork,
            33 * 1e9,
            defaultWithdrawalAddressHex,
        );
        expect(invalidCredential.amount).to.be.gt(MAX_DEPOSIT_AMOUNT) && expect(() => invalidCredential.depositData).to.throw("Invalid deposit amount");
    });

    it("credential returns correct signing public key hex", () => {
        const signingPublicKey = credential.signingPublicKey.toHex();
        // TODO: verify!
        expect(signingPublicKey).to.equal("0xa84128adbc8a1b1be6d06d8c24b9371f9cd71709cf287df628d8f1c89eb6be94e15c79453e290dcede1434a8f623b8e4");
    });

    it("credential returns correct withdrawal public key hex", () => {
        const withdrawalPublicKey = credential.withdrawalPublicKey.toHex();
        // TODO: verify!
        expect(withdrawalPublicKey).to.equal("0x892f3b487595f337437fd08fba9f32b51c4e62e3fc3d154ca43bcf9852183825e0e36e2c3578d0d01d9d3602e44abd9c");
    });
});

describe("CredentialList", () => {
    const credentialList = new CredentialList(
        defaultMnemonic,
        defaultValidatorsCount,
        defaultNetwork,
        defaultAmount,
        defaultWithdrawalAddressHex,
        defaultStartIndex
    );

    it("object is a list of validator credentials", () => {
        expect(credentialList).instanceOf(CredentialList).and.to.be.lengthOf(defaultValidatorsCount);
    });

    it(`properly returns deposit data of ${defaultValidatorsCount} validators`, () => {
        expect(credentialList.depositData).to.be.lengthOf(defaultValidatorsCount);
    });

    it("credential list accepts variable amounts", () => {
        const validatorCount = 2;
        const credentialList =  new CredentialList(
            defaultMnemonic,
            validatorCount,
            defaultNetwork,
            [defaultAmount, 17 * 1e9],
            defaultWithdrawalAddressHex,
            defaultStartIndex
        );
        expect(credentialList).to.be.instanceOf(CredentialList).and.to.be.lengthOf(validatorCount);
    });

    it("credential list requires amounts count to be equal to validators count", () => {
        const validatorCount = 1;
        expect(() => new CredentialList(
            defaultMnemonic,
            validatorCount,
            defaultNetwork,
            [defaultAmount, defaultAmount],
            defaultWithdrawalAddressHex,
            defaultStartIndex
        )).to.throw("Parameter 'amounts' must be a number or an Array of numbers with length equal to number of validators");
    });

    it("credential list returns correct signing secret keys", () => {
        // We expect the first two signing secret keys to be the following (in hex):
        // TODO: verify!
        const expectedSigningSecretKeys = [
            "0x45eaf8631521e8e9f39dee3eae4b6727b6a2e645fde17db233dedcbd2cff2e99",
            "0x48b9269ce1af7dd7c45d61834f432dfd540068981f354450cc1e3363f293cdd0"
        ];
        expect(credentialList.signingSecretKeys.map(secretKey => secretKey.toHex())).to.deep.equal(expectedSigningSecretKeys);
    });

    it("credential list returns correct signing public keys", () => {
        // We expect the first two signing public keys to be the following (in hex):
        // TODO: verify!
        const expectedSigningPublicKeys = [
            "0xa84128adbc8a1b1be6d06d8c24b9371f9cd71709cf287df628d8f1c89eb6be94e15c79453e290dcede1434a8f623b8e4",
            "0x8a77a8826a71240b071efc79a429476edc59800f28e972fc11c7608ee3147cd0099014752aaf29e0220665033e413cb1"
        ];
        expect(credentialList.signingPublicKeys.map(publicKey => publicKey.toHex())).to.deep.equal(expectedSigningPublicKeys);
    });

    it("credential list returns correct withdrawal secret keys", () => {
        // We expect the first two withdrawal secret keys to be the following (in hex):
        // TODO: verify!
        const expectedWithdrawalSecretKeys = [
            "0x58c2601343f1d208947ae380742810951d32863f8923f2ef47ad130a038fc02e",
            "0x279f64432c5a692caad42bae9a43b721549763aadb245cf444c5039b1bca0404"
        ];
        expect(credentialList.withdrawalSecretKeys.map(secretKey => secretKey.toHex())).to.deep.equal(expectedWithdrawalSecretKeys);
    });

    it("credential list returns correct withdrawal public keys", () => {
        // We expect the first two withdrawal public keys to be the following (in hex):
        // TODO: verify!
        const expectedWithdrawalPublicKeys = [
            "0x892f3b487595f337437fd08fba9f32b51c4e62e3fc3d154ca43bcf9852183825e0e36e2c3578d0d01d9d3602e44abd9c",
            "0x99920c7628447e5e3c6704a9c8dc4108a9852b16ad275525c31f78a0d7db9f3eacbbe10c2107824837d35f7c94e922d3"
        ];
        expect(credentialList.withdrawalPublicKeys.map(publicKey => publicKey.toHex())).to.deep.equal(expectedWithdrawalPublicKeys);
    });
});
