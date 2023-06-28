import { hexToString } from "viem";
import { motion } from "framer-motion";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { formatTimestamp } from "../../lib/formatTimestamp";

const MemberItem = ({member} : any) => {
    return (
        <motion.div layout className="w-full rounded-lg border border-customSlate-300 mb-3 p-5">
            <motion.div layout="position">
                <div className="">
                    <Jazzicon diameter={20} seed={jsNumberForAddress(member.address)} />
                </div>
                <div className="">
                    <motion.p className="text-xl font-bold text-customSlate-50">{hexToString(member.name)}</motion.p>
                    <motion.p className=" text-sm text-customSlate-200">{member.address}</motion.p>
                    <p>{formatTimestamp(member.memberSince)}</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MemberItem;
