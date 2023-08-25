import bls from "@chainsafe/bls";
import type { SecretKey, PublicKey } from "@chainsafe/bls/types";
import { deriveKeyFromMnemonic, deriveEth2ValidatorKeys } from "@chainsafe/bls-keygen";
import { ValueOf } from "@chainsafe/ssz";
import { computeDepositDomain, computeSigningRoot, DepositMessage, SignedDeposit, DepositData } from "./signing.ts";
import { BaseChainSetting, getChainSetting } from "./settings.ts";
import { MIN_DEPOSIT_AMOUNT, MAX_DEPOSIT_AMOUNT } from "./constants.ts";
import { EthereumDepositData } from "./types.ts";

export class Credential {
    withdrawalSecretKey: SecretKey;
    signingSecretKey: SecretKey;
    amount: number;
    withdrawalAddressHex: string;
    chainSetting: BaseChainSetting;

    constructor(mnemonic: string, index: number, chain: string, amount: number, withdrawalAddressHex: string) {
        const masterSecretKey = deriveKeyFromMnemonic(mnemonic);
        const { withdrawal, signing } = deriveEth2ValidatorKeys(masterSecretKey, index);
        this.withdrawalSecretKey = bls.SecretKey.fromBytes(withdrawal);
        this.signingSecretKey = bls.SecretKey.fromBytes(signing);
        this.amount = amount;
        this.withdrawalAddressHex = withdrawalAddressHex;
        this.chainSetting = getChainSetting(chain);
    }

    get signingPublicKey(): PublicKey {
        return this.signingSecretKey.toPublicKey();
    }

    get withdrawalPublicKey(): PublicKey {
        return this.withdrawalSecretKey.toPublicKey();
    }

    get withdrawalCredentials() {
        const prefix = new Uint8Array(Buffer.from("01", "hex"));
        const withdrawalCredentials = new Uint8Array([
            ...prefix,
            ...new Uint8Array(11).fill(0),
            ...new Uint8Array(Buffer.from(this.withdrawalAddressHex.replace(/0x/g, ""), "hex")),
        ]);

        return withdrawalCredentials;
    }

    get depositMessage(): ValueOf<typeof DepositMessage> {
        if (this.amount < MIN_DEPOSIT_AMOUNT || this.amount > MAX_DEPOSIT_AMOUNT) {
            throw new Error("Invalid deposit amount");
        }
        const depositMessage = {
            pubkey: this.signingPublicKey.toBytes(),
            withdrawal_credentials: this.withdrawalCredentials,
            amount: this.amount,
        };

        return depositMessage;
    }

    get signedDeposit(): ValueOf<typeof SignedDeposit> {
        const domain = computeDepositDomain(this.chainSetting.GENESIS_FORK_VERSION);
        const signingRoot = computeSigningRoot(this.depositMessage, DepositMessage, domain);
        const signature = bls.sign(this.signingSecretKey.toBytes(), signingRoot);

        return {
            ...this.depositMessage,
            signature,
        };
    }

    get rawDepositData(): ValueOf<typeof DepositData> {
        const signedDeposit = this.signedDeposit;

        const depositData = {
            ...signedDeposit,
            deposit_message_root: DepositMessage.hashTreeRoot(this.depositMessage),
            deposit_data_root: SignedDeposit.hashTreeRoot(signedDeposit),
            fork_version: this.chainSetting.GENESIS_FORK_VERSION,
            network_name: new TextEncoder().encode(this.chainSetting.NETWORK_NAME),
        };

        return depositData ;
    }

    get depositData(): EthereumDepositData {
        const rawDepositData = this.rawDepositData;

        return {
            pubkey: Buffer.from(rawDepositData.pubkey).toString("hex"),
            withdrawal_credentials: Buffer.from(rawDepositData.withdrawal_credentials).toString("hex"),
            amount: BigInt(rawDepositData.amount), // Keep amount as a number
            signature: Buffer.from(rawDepositData.signature).toString("hex"),
            deposit_message_root: Buffer.from(rawDepositData.deposit_message_root).toString("hex"),
            deposit_data_root: Buffer.from(rawDepositData.deposit_data_root).toString("hex"),
            fork_version: Buffer.from(rawDepositData.fork_version).toString("hex"),
            network_name: new TextDecoder().decode(rawDepositData.network_name), // Decode to a human-readable string
        };
    }

}

export class CredentialList extends Array<Credential> {
    constructor(
        mnemonic: string, nValidators: number,
        chain: string,
        amounts: number[] | number,
        withdrawalAddressHex: string,
        startIndex: number = 0,
    ) {
        if (Array.isArray(amounts) && amounts.length !== nValidators) {
            throw new Error("Parameter 'amounts' must be a number or an Array of numbers with length equal to number of validators");
        }
        super();
        for (let i = startIndex; i < startIndex + nValidators; i++) {
            let amount;
            if (typeof amounts === "number") {
                amount = amounts;
            } else {
                amount = amounts[i];
            }
            const credential = new Credential(mnemonic, i, chain, amount, withdrawalAddressHex);
            this.push(credential);
        }
    }

    get signingSecretKeys(): SecretKey[] {
        return this.map((credential) => credential.signingSecretKey);
    }

    get signingPublicKeys(): PublicKey[] {
        return this.map((credential) => credential.signingPublicKey);
    }

    get withdrawalSecretKeys(): SecretKey[] {
        return this.map((credential) => credential.withdrawalSecretKey);
    }

    get withdrawalPublicKeys(): PublicKey[] {
        return this.map((credential) => credential.withdrawalPublicKey);
    }

    get depositData(): EthereumDepositData[] {
        return this.map((credential) => credential.depositData);
    }
}
