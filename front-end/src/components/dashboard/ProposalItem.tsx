import { ArrowUp, ArrowDown } from "lucide-react";
import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { formatTimestamp2 } from "../../lib/formatTimestamp";
import { calculateRemainingTime } from "../../lib/calculateRemainingTime";
import { calculateUpvotePercentage } from "../../lib/calculateUpvotePercentage";
import { useToast } from "../ui/use-toast";

const ProposalItem = ({ proposal, refetchProposals }: any) => {
    const { toast } = useToast();
    const { chain } = useNetwork();
    const currentDate = Math.floor(Date.now() / 1000);

    const { write, data: voteData } = useContractWrite({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "vote",

        onSuccess(data) {
            console.log(`succesfully written...`);
            console.log(data);
        },
        onError(error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
            console.log(error);
        },
    });

    const waitForTransaction = useWaitForTransaction({
        hash: voteData?.hash,

        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchProposals();
        },
    });

    return (
        <div>
            <div className="w-full bg-customSlate-900 p-5 my-4 rounded-lg">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium">{proposal.title}</h3>
                    {currentDate < proposal.endDate ? (
                        <Badge variant="secondary" className="py-0 h-5 text-[10px]">
                            ACTIVE
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="py-0 h-5 text-[10px] bg-black text-white ">
                            ENDED
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-customSlate-400">
                    CREATED BY {proposal.creator} • {formatTimestamp2(proposal.startDate)}
                </p>
                <div className="my-5">
                    <p className="text-sm">{proposal.description}</p>
                </div>
                <div>
                    <p className="text-xs text-customSlate-400 mb-2">CURRENT SUPPORT</p>
                    <Progress
                        className="bg-customSlate-600 h-3"
                        value={calculateUpvotePercentage(proposal.upVotes, proposal.downVotes)}
                    />
                    <div className="flex mt-3 justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center text-sm">
                                <ArrowUp
                                    aria-label="upvote"
                                    onClick={() => {
                                        write({
                                            args: [proposal.id, 1],
                                        });
                                    }}
                                    className="h-6 w-6 text-customSlate-400 cursor-pointer hover:text-accent2"
                                ></ArrowUp>
                                <p>{proposal.upVotes}</p>
                                <ArrowDown
                                    aria-label="downvote"
                                    onClick={() => {
                                        write({
                                            args: [proposal.id, 0],
                                        });
                                    }}
                                    className="h-6 w-6 text-customSlate-400 cursor-pointer hover:text-accent2"
                                />
                                <p>{proposal.downVotes}</p>
                            </div>
                            <div>
                                <p className="text-sm text-customSlate-400">
                                    Votes <span className="text-white text-sm">{proposal.voteCount}</span>
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-customSlate-400 text-sm">
                                Time Remaining{" "}
                                <span className="text-white">
                                    {calculateRemainingTime(proposal.endDate).days}D{" "}
                                    <span className="text-customSlate-400"> | </span>
                                    {calculateRemainingTime(proposal.endDate).hours}H{" "}
                                    <span className="text-customSlate-400"> | </span>
                                    {calculateRemainingTime(proposal.endDate).minutes}M
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalItem;
