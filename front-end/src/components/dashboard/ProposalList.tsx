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
            {proposalData
                ? filterProposals(proposalData, searchValue, active).map((proposal: any) => (
                      <ProposalItem key={proposal} proposal={proposal} refetchProposals={refetchProposals} />
                  ))
                : null}
        </div>
    );
};

export default ProposalList;
