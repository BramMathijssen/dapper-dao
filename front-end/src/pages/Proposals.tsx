import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import { Separator } from "../components/ui/separator";
import AddProposalForm from "../components/proposals/AddProposalForm";
import useFetchProposals from "../hooks/useFetchProposals";
import ProposalList from "../components/proposals/ProposalList";

const Members = () => {
    const [clicked, setClicked] = useState<boolean>(false);
    const [proposalData, refetchProposals] = useFetchProposals();

    return (
        <Layout>
            <div className="flex flex-row gap-2 h-full">
                <motion.div
                    onClick={() => setClicked(true)}
                    layout
                    className={`${clicked ? "flex-[0.6]" : "flex-[0.35]"} bg-accent2 rounded-lg p-9`}
                >
                    <motion.div layout="position">
                        <h2 className=" text-xl font-medium text-slate-900 mb-7">Create a Proposal</h2>
                        <AddProposalForm refetchProposals={refetchProposals} />
                    </motion.div>
                </motion.div>
                <motion.div
                    onClick={() => setClicked(false)}
                    layout
                    className={`rounded-lg flex-1 bg-[url('./assets/images/grain.jpg')] bg-cover`}
                >
                    <div className="w-full h-full bg-myPrimary-200/90 rounded-lg p-9">
                        <motion.div>
                            <motion.h2 layout="position" className=" text-xl font-medium text-slate-50 mb-5">
                                Registered Proposals
                            </motion.h2>
                            <Separator className="bg-customSlate-700 mb-6" />
                            <ProposalList proposalData={proposalData} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default Members;
