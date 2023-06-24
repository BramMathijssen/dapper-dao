import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import Layout from "../layout/Layout";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Address, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { motion } from "framer-motion";

const MyDashboard = () => {
    const { chain } = useNetwork();

    const { data: proposalData, refetch: fetechProposals } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        onSuccess(data) {
            console.log("Success", data);
        },
    });

    return (
        <Layout>
            <div className="flex flex-col h-full gap-y-20">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$45,231.89</div>
                            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+2350</div>
                            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Members</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+12,234</div>
                            <p className="text-xs text-muted-foreground">+19% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
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
                            <h3 className="text-sm text-medium mb-3">Sort By</h3>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Time Added" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Fruits</SelectLabel>
                                        <SelectItem value="apple">Apple</SelectItem>
                                        <SelectItem value="banana">Banana</SelectItem>
                                        <SelectItem value="blueberry">Blueberry</SelectItem>
                                        <SelectItem value="grapes">Grapes</SelectItem>
                                        <SelectItem value="pineapple">Pineapple</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <h3 className="text-sm text-medium mb-3 mt-5">Search Proposal</h3>
                            <Input placeholder="Proposal Description" />
                        </CardContent>
                    </Card>
                    <Card className="col-span-8 bg-myPrimary-200 border-none">
                        <CardHeader>
                            <CardTitle>Proposals</CardTitle>
                            <CardDescription>Cast your vote on the latest proposals</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {proposalData
                                ? proposalData.map((proposal) => (
                                      <motion.div layout className="w-full rounded-lg border border-customSlate-300 mb-3 p-5">
                                          <p>{proposal.description}</p>
                                      </motion.div>
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
