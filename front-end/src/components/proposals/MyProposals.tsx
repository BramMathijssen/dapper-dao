import { useState } from "react";
import Layout from "../layout/Layout";
import { useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { formatTimestamp2 } from "../../lib/formatTimestamp";
import { Textarea } from "../ui/textarea";

const MyProposals = () => {
    const { chain } = useNetwork();
    const [clicked, setClicked] = useState<boolean>(false);

    const transform = (data: any) => {
        return data;
    };

    const { data: proposalData, refetch: refetchMembers } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getAllProposals",
        args: [],
        select: (data) => transform(data),
        onSuccess(data) {
            console.log("Success", data);
        },
    });
    console.log(getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT)?.toString());

    const {
        write,
        data: addMemberData,
        isLoading: addMemberLoading,
    } = useContractWrite({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "createProposal",

        onSuccess(data) {
            console.log(`succesfully written...`);
            console.log(data);
        },
    });

    const {isLoading: addMemberWaitLoading} = useWaitForTransaction({
        hash: addMemberData?.hash,
        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchMembers();
        },
    });

    const formSchema = z.object({
        description: z.string().min(2).max(200),
        duration: z.string().min(1).max(50),
        title: z.string().min(1).max(50),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            duration: "",
        },
        mode: "all",
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        write({
            args: [values.title, values.description, values.duration],
        });
    }

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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Title</FormLabel>
                                            <FormControl>
                                                <Input className="border-black text-black" placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="border-black text-black"
                                                    placeholder=""
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Duration</FormLabel>
                                            <motion.div layout>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-black text-black">
                                                            <SelectValue placeholder="Select a verified email to display" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">Day</SelectItem>
                                                        <SelectItem value="1">Week</SelectItem>
                                                        <SelectItem value="2">Month</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </motion.div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {addMemberLoading || addMemberWaitLoading ? (
                                    <Button disabled>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button type="submit" size="wide">
                                        CREATE
                                    </Button>
                                )}
                            </form>
                        </Form>
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
                                Current Proposals
                            </motion.h2>
                            <Separator className="bg-customSlate-700 mb-6" />

                            {proposalData ? (
                                proposalData.map((proposal: any) => (
                                    <motion.div
                                        layout
                                        className="w-full rounded-lg border border-customSlate-300 mb-3 p-5"
                                    >
                                        <div className="w-full">
                                            <div className="flex items-center gap-4">
                                                <h3 className="text-lg font-medium">{proposal.title}</h3>
                                            </div>
                                            <p className="text-xs text-customSlate-400">
                                                CREATED BY {proposal.creator} • {formatTimestamp2(proposal.startDate)}
                                            </p>
                                            <div className="mt-5">
                                                <p className="text-sm">{proposal.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p>No proposals found</p>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default MyProposals;
