import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { createSurfClient } from "@thalalabs/surf";

import { ABI } from "@/lib/abi/message_board_abi";

export const NETWORK = Network.TESTNET;

const APTOS_CLIENT = new Aptos(
  new AptosConfig({
    network: NETWORK,
  })
);

const SURF_CLIENT = createSurfClient(APTOS_CLIENT).useABI(ABI);

export const getAptosClient = () => APTOS_CLIENT;

export const getSurfClient = () => SURF_CLIENT;

export const CORE_MODULE: string =
  "0x95d96f27d5928dbf5f09f898ea97b373c9d312789e1392ba7e8a0004d714dfa7";
export const BERRIES_MODULE: string =
  "0xe2079a607cd4a25f6b8a711f9e6dcba29d60eb25df3c8af9ceeaefef1c224c9a";
