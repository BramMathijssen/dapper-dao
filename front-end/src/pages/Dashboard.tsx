import { useState } from "react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Layout from "../components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Filters from "../components/dashboard/Filters";
import ProposalList from "../components/dashboard/ProposalList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import useFetchMembers from "../hooks/useFetchMembers";
import useFetchProposals from "../hooks/useFetchProposals";

const Dashboard = () => {
    const [searchValue, setSearchValue] = useState("");
    const [memberData, refetchMembers] = useFetchMembers();
    const [proposalData, refetchProposals] = useFetchProposals();

    const searchFieldHandler = (e: any) => {
        setSearchValue(e.target.value);
    };

    return (
        <>
            <Layout>
                <div className="flex flex-col h-full gap-y-16">
                    <DashboardHeader members={memberData} proposals={proposalData} />
                    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-10 grow">
                        <Card className="col-span-2 border-none">
                            <CardHeader className="p-0">
                                <CardTitle className=" text-lg">Filters</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-5">
                                <Filters handleFilterChange={searchFieldHandler} />
                            </CardContent>
                        </Card>
                        <Card className="col-span-8 border-none">
                            <Tabs defaultValue="active" className="my-0 py-0">
                                <CardHeader className="p-0 flex flex-row justify-between mb-6">
                                    <div>
                                        <CardTitle>Proposals</CardTitle>
                                        <CardDescription className="text-customSlate-400">
                                            Cast your vote on the latest proposals
                                        </CardDescription>
                                    </div>
                                    <div>
                                        <TabsList className="grid w-[200px] grid-cols-2 ml-auto">
                                            <TabsTrigger value="active">Active</TabsTrigger>
                                            <TabsTrigger value="ended">Ended</TabsTrigger>
                                        </TabsList>
                                    </div>
                                </CardHeader>
                                <TabsContent value="active">
                                    <ProposalList proposalData={proposalData} refetchProposals={refetchProposals} searchValue={searchValue} active={true} />
                                </TabsContent>
                                <TabsContent value="ended">
                                    <ProposalList proposalData={proposalData} refetchProposals={refetchProposals} searchValue={searchValue} active={false} />
                                </TabsContent>
                            </Tabs>
                        </Card>
                    </div>
                </div>
            </Layout>
        </>
    );
};

export default Dashboard;
