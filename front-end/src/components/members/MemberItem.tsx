import { hexToString } from "viem";
import { motion } from "framer-motion";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { formatTimestamp } from "../../lib/formatTimestamp";

const MemberItem = ({member} : any) => {
    return (
        <motion.div layout className="w-full rounded-lg border border-customSlate-300 mb-3 p-5">
            <motion.div layout="position" className="flex items-center gap-4">
                <div className="">
                    <Jazzicon diameter={30} seed={jsNumberForAddress(member.address)} />
                </div>
                <div className="">
                    <motion.p className="text-lg font-bold text-customSlate-50">{hexToString(member.name)}</motion.p>
                    <motion.p className="text-xs mb-3 text-customSlate-300">Added: {formatTimestamp(member.memberSince)}</motion.p>
                    <motion.p className=" text-sm text-customSlate-200">{member.address}</motion.p>
                    
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MemberItem;
