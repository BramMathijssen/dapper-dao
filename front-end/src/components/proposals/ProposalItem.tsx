import { motion } from "framer-motion";
import { formatTimestamp2 } from "../../lib/formatTimestamp";

const ProposalItem = ({ proposal }: any) => {
    return (
        <motion.div layout className="w-full rounded-lg border border-customSlate-300 mb-3 p-5  overflow-x-hidden">
            <motion.div layout="position" className="w-full">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">{proposal.title}</h3>
                </div>
                <p className="text-xs text-customSlate-400">
                    CREATED BY {proposal.creator} • {formatTimestamp2(proposal.startDate)}
                </p>
                <div className="mt-5">
                    <p className="text-sm">{proposal.description}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProposalItem;
