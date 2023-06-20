import { contractAddresses } from "../constants";

export const CONTRACTS = {
    DAO_CONTRACT: "daoContract",
};

interface ContractAddresses {
    [key: number]: {
      [key: string]: string[];
    };
  }

export const getContractAddressByChain = (chainId: number, contractName: string): string | undefined => {
    if (!chainId) return;
    try {
        const contractAddress: ContractAddresses = contractAddresses;
        return contractAddress[chainId][contractName][0];
    } catch (error) {
        console.log(error);
        // throw new Error("Not found");
    }
};
