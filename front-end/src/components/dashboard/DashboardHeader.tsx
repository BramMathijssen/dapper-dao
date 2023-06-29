import { calculateUpvotePercentage } from "../../lib/calculateUpvotePercentage";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Activity, Users, CircleOff, CheckCircle } from "lucide-react";

const DashboardHeader = ({ proposals, members }: any) => {

    function checkProposalActive(proposals: any) {
        const currentDate = Math.floor(Date.now() / 1000);

        const activeProposals = proposals.filter((proposal: any) => currentDate < proposal.endDate);
        const endedProposals = proposals.filter((proposal: any) => currentDate > proposal.endDate);

        return [activeProposals, endedProposals];
    }

    function checkEndedProposals(proposals: any) {
        const [, endedProposals] = checkProposalActive(proposals);
        const passedProposals = endedProposals.filter(
            (proposal: any) => calculateUpvotePercentage(proposal.upVotes, proposal.downVotes) > 50
        );

        const declinedProposals = endedProposals.filter(
            (proposal: any) => calculateUpvotePercentage(proposal.upVotes, proposal.downVotes) < 50
        );

        return [passedProposals, declinedProposals];
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{proposals && checkProposalActive(proposals)[0].length}</div>
                    <p className="text-xs text-muted-foreground">+5.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Passed Proposals</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{proposals &&  checkEndedProposals(proposals)[0].length}</div>
                    <p className="text-xs text-muted-foreground">+23.1% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Declined Proposals</CardTitle>
                    <CircleOff className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{proposals &&  checkEndedProposals(proposals)[1].length}</div>
                    <p className="text-xs text-muted-foreground">+13% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{members && members.length}</div>
                    <p className="text-xs text-muted-foreground">+1 since last hour</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardHeader;
