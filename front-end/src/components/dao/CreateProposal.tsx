import React from "react";
import Layout from "../layout/Layout";
import { Address, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { Button } from "../ui/button";

const CreateProposal = () => {
    const { chain } = useNetwork();

    const {
        data: data3,
        isError: error3,
        isLoading: loading3,
        refetch: refetchMembers,
    } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        },
    });
    console.log(getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT)?.toString());

    const { write, data: addMemberData } = useContractWrite({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "createProposal",

        onSuccess(data) {
            console.log(`succesfully written...`);
            console.log(data);
        },
    });

    const waitForTransaction = useWaitForTransaction({
        hash: addMemberData?.hash,

        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchMembers();
        },
    });

    const onFormSubmitHandler = (proposalDescription: string, proposalDuration: number) => {
        write({
            args: [proposalDescription, proposalDuration],
        });
    };

    return (
        <Layout>
            <div>MyDao</div>
            <Button onClick={() => onFormSubmitHandler("This is the best proposal ever created", 1)}>Write</Button>
        </Layout>
    );
};

export default CreateProposal;
