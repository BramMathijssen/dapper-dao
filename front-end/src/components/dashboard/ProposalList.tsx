import { useContractRead, useNetwork } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "../../lib/getContractAddressByChain";
import { daoContractAbi } from "../../constants";
import ProposalItem from "./ProposalItem";

const ProposalList = ({ searchValue, active }: any) => {
    const { chain } = useNetwork();

    const { data: proposalData, refetch: refetchProposals } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        onSuccess(data) {
            console.log(`refetching...`);
            console.log("Success", data);
        },
    });

    const filterProposals = (proposals: any, input: string, active: boolean) => {
        const currentDate = Math.floor(Date.now() / 1000);

        const filteredProposals = proposals.filter((proposal: any) =>
            proposal.title.toLowerCase().includes(input.toLowerCase())
        );

        if (active === true) {
            const activeProposals = filteredProposals.filter((proposal: any) => currentDate < proposal.endDate);
            return activeProposals;
        } else if (active === false) {
            const endedProposals = filteredProposals.filter((proposal: any) => currentDate > proposal.endDate);
            return endedProposals;
        }
    };

    return (
        <div>
            {proposalData
                ? filterProposals(proposalData, searchValue, active).map((proposal: any) => (
                      <ProposalItem key={proposal.id} proposal={proposal} refetchProposals={refetchProposals} />
                  ))
                : null}
        </div>
    );
};

export default ProposalList;
