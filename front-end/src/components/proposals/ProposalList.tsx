import ProposalItem from "./ProposalItem";

const ProposalList = ({ proposalData }: any) => {
    return (
        <>
            {proposalData.length > 0 ? (
                proposalData.map((proposal: any) => <ProposalItem key={proposal.id} proposal={proposal} />)
            ) : (
                <p>No proposals found</p>
            )}
        </>
    );
};

export default ProposalList;
