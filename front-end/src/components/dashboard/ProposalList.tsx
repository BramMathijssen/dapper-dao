import ProposalItem from "./ProposalItem";

const ProposalList = ({ searchValue, active, proposalData, refetchProposals }: any) => {
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
            {proposalData && proposalData.length > 0 ? (
                filterProposals(proposalData, searchValue, active).map((proposal: any) => (
                    <ProposalItem key={proposal} proposal={proposal} refetchProposals={refetchProposals} />
                ))
            ) : (
                <p>No Proposals Found</p>
            )}
        </div>
    );
};

export default ProposalList;
