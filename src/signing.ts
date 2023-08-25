import { ContainerType, ByteVectorType, UintNumberType, Type } from "@chainsafe/ssz";
import { DOMAIN_DEPOSIT, DOMAIN_BLS_TO_EXECUTION_CHANGE } from "./constants.ts";

const SigningData = new ContainerType({
  object_root: new ByteVectorType(32),
  domain: new ByteVectorType(32),
});

const signingData = SigningData.defaultValue();

SigningData.hashTreeRoot(signingData);

const ForkData = new ContainerType({
  currentVersion: new ByteVectorType(4),
  genesisValidatorsRoot: new ByteVectorType(32),
});

function computeForkDataRoot(currentVersion: Uint8Array, genesisValidatorsRoot: Uint8Array): Uint8Array {
  if (currentVersion.length !== 4) {
    throw new Error(`Fork version should be 4 bytes, got ${currentVersion.length}`);
  }
  return ForkData.hashTreeRoot({
    currentVersion,
    genesisValidatorsRoot,
  });
}

function computeDepositForkDataRoot(currentVersion: Uint8Array): Uint8Array {
  return computeForkDataRoot(currentVersion, new Uint8Array(32).fill(0));
}

export function computeDepositDomain(forkVersion: Uint8Array): Uint8Array {
  if (forkVersion.length !== 4) {
    throw new Error(`Fork version should be 4 bytes, got ${forkVersion.length}`);
  }
  const forkDataRoot = computeDepositForkDataRoot(forkVersion);
  return new Uint8Array([...DOMAIN_DEPOSIT, ...forkDataRoot.slice(0, 28)]);
}

export function computeBlsToExecutionChangeDomain(forkVersion: Uint8Array, genesisValidatorsRoot: Uint8Array): Uint8Array {
  if (forkVersion.length !== 4) {
    throw new Error(`Fork version should be 4 bytes, got ${forkVersion.length}`);
  }
  const forkDataRoot = computeForkDataRoot(forkVersion, genesisValidatorsRoot);
  return new Uint8Array([...DOMAIN_BLS_TO_EXECUTION_CHANGE, ...forkDataRoot.slice(0, 28)]);
}

export function computeSigningRoot<V>(sszObject: V, type: Type<V>, domain: Uint8Array): Uint8Array {
  if (domain.length !== 32) {
    throw new Error(`Domain should be 32 bytes, got ${domain.length}`);
  }
  const signingRoot = SigningData.hashTreeRoot({
    object_root: type.hashTreeRoot(sszObject),
    domain,
  });
  return signingRoot;
}

export const DepositMessage = new ContainerType({
  pubkey: new ByteVectorType(48),
  withdrawal_credentials: new ByteVectorType(32),
  amount: new UintNumberType(8),
});

export const SignedDeposit = new ContainerType({
  ...DepositMessage.fields,
  signature: new ByteVectorType(96),
});

export const DepositData = new ContainerType({
  ...SignedDeposit.fields,
  deposit_data_root: new ByteVectorType(32),
  deposit_message_root: new ByteVectorType(32),
  fork_version: new ByteVectorType(4),
  network_name: new ByteVectorType(32),
});

export const blsToExecutionChange = new ContainerType({
  validator_index: new UintNumberType(8),
  from_bls_pubkey: new ByteVectorType(48),
  to_execution_address: new ByteVectorType(20),
});

export const signedBlsToExecutionChange = new ContainerType({
  message: blsToExecutionChange,
  signature: new ByteVectorType(96),
});
