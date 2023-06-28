import useFetchProposals from "@/src/hooks/useFetchProposals";
import { motion } from "framer-motion";
import ProposalItem from "./ProposalItem";

const ProposalList = ({ proposalData }: any) => {
    return (
        <>
            {proposalData.length > 0 ? (
                proposalData.map((proposal: any) => <ProposalItem proposal={proposal} />)
            ) : (
                <p>No proposals found</p>
            )}
        </>
    );
};

export default ProposalList;
