import { useContractRead, useNetwork } from "wagmi";
import { daoContractAbi } from "../constants";
import { CONTRACTS, getContractAddressByChain } from "../lib/getContractAddressByChain";

const useFetchMembers = () => {
    const { chain } = useNetwork();

    const transform = (data: any) => {
        const transformedArray = data[0].map((value: any, index: any) => ({
            address: data[0][index],
            valid: data[1][index],
            name: data[2][index],
            memberSince: data[3][index],
        }));

        // sorts array so latest added array is first
        const sortedArray = transformedArray.sort((a: any, b: any) => Number(b.memberSince) - Number(a.memberSince));
        return sortedArray;
    };

    const { data: memberData, refetch: refetchMembers } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getMembers",
        args: [],
        select: (data) => transform(data),
        onSuccess(data) {
            console.log("Success", data);
        },
    });

    return [memberData, refetchMembers];
};

export default useFetchMembers;
