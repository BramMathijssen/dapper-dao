import { motion } from "framer-motion";
import MemberItem from "./MemberItem";

const MemberList = ({memberData}: any) => {
    return (
        <motion.div>
            {memberData.length > 0 ? (
                memberData.map((member: any, index: any) => <MemberItem key={index} member={member} />)
            ) : (
                <p>No members found</p>
            )}
        </motion.div>
    );
};

export default MemberList;
