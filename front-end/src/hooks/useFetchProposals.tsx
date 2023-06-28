import { useContractRead, useNetwork } from "wagmi";
import { daoContractAbi } from "../constants";
import { CONTRACTS, getContractAddressByChain } from "../lib/getContractAddressByChain";

const useFetchProposals = () => {
    const { chain } = useNetwork();

    const { data: proposalData, refetch: refetchProposals } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        },
    });

    return [ proposalData, refetchProposals ];
};

export default useFetchProposals;
