import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Activity, CreditCard, DollarSign, Users, ArrowUp, ArrowDown, CircleOff, CheckCircle } from "lucide-react";
import Layout from "../layout/Layout";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { useContractRead, useContractReads, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { motion } from "framer-motion";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { formatTimestamp2 } from "../../lib/formatTimestamp";
import { calculateRemainingTime } from "../../lib/calculateRemainingTime";
import { Separator } from "../ui/separator";
import { calculateUpvotePercentage } from "../../lib/calculateUpvotePercentage";
import { useToast } from "../ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const MyDashboard = () => {
    const { chain } = useNetwork();
    const currentDate = Math.floor(Date.now() / 1000);
    const [searchValue, setSearchValue] = useState("");
    const { toast } = useToast();

    const { data: proposalData, refetch: retechProposals } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        },
    });

    const filterProposals = (proposals: any, input: string) => {
        const filtered = proposals.filter((proposal) => proposal.title.toLowerCase().includes(input.toLowerCase()));

        return filtered;
    };

    const searchFieldHandler = (e: any) => {
        setSearchValue(e.target.value);
    };

    const {
        write,
        data: voteData,
        isError: isVoteError,
        error: voteError,
    } = useContractWrite({
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
            retechProposals();
        },
    });

    return (
        <Layout>
            <div className="flex flex-col h-full gap-y-20">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{proposalData.length}</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Passed Proposals</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Declined Proposals</CardTitle>
                            <CircleOff className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+573</div>
                            <p className="text-xs text-muted-foreground">+201 since last hour</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-10 grow">
                    <Card className="col-span-2 border-none">
                        <CardHeader className="p-0">
                            <CardTitle className=" text-lg">Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-5">
                            <h3 className="text-sm text-medium mb-3 mt-5">Search Proposal</h3>
                            <Input placeholder="Proposal Description" onChange={(e) => searchFieldHandler(e)} />
                            <h3 className="text-sm text-medium mb-3 mt-5">Sort By</h3>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Time Added" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Most Votes</SelectLabel>
                                        <SelectItem value="apple">Active</SelectItem>
                                        <SelectItem value="banana">Ended</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>
                    <Card className="col-span-8 bg-myPrimary-200 border-none">
                        <CardHeader>
                            <CardTitle>Proposals</CardTitle>
                            <CardDescription className="text-customSlate-400">Cast your vote on the latest proposals</CardDescription>
                            <SelectSeparator className="bg-customSlate-600" />
                        </CardHeader>
                        <CardContent>
                            {proposalData
                                ? filterProposals(proposalData, searchValue).map((proposal) => (
                                      <div className="w-full">
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
                                              <Progress className="bg-customSlate-600 h-3" value={calculateUpvotePercentage(proposal.upVotes, proposal.downVotes)} />
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
                                                              {calculateRemainingTime(proposal.endDate).days}D <span className="text-customSlate-400"> | </span>
                                                              {calculateRemainingTime(proposal.endDate).hours}H <span className="text-customSlate-400"> | </span>
                                                              {calculateRemainingTime(proposal.endDate).minutes}M
                                                          </span>
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>
                                          <SelectSeparator className="my-5 bg-customSlate-600" />
                                      </div>
                                  ))
                                : null}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default MyDashboard;
