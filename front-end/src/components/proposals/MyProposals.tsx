import React, { useState } from "react";
import Layout from "../layout/Layout";
import { Address, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "./../../lib/getContractAddressByChain";
import { daoContractAbi } from "./../../constants";
import { Button } from "../ui/button";
import { hexToString, stringToHex } from "viem";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { formatTimestamp } from "../../lib/formatTimestamp";
import { Textarea } from "../ui/textarea";

const MyProposals = () => {
    const { chain } = useNetwork();
    const [clicked, setClicked] = useState<boolean>(false);

    const transform = (data: any) => {

        return data;
    };

    const {
        data: proposalData,
        isError: error3,
        isLoading: loading3,
        refetch: refetchMembers,
    } = useContractRead({
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

    const waitForTransaction = useWaitForTransaction({
        hash: addMemberData?.hash,

        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchMembers();
        },
    });

    const formSchema = z.object({
        description: z.string().min(2).max(50),
        duration: z.string().min(1).max(50),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            args: [values.description, values.duration],
        });
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2 h-full">
                <motion.div onClick={() => setClicked(true)} layout className={`${clicked ? "flex-[0.6]" : "flex-[0.35]"} bg-accent2 rounded-lg p-9`}>
                    <motion.div layout="position">
                        <h2 className=" text-xl font-medium text-slate-900 mb-7">Create a Proposal</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Description</FormLabel>
                                            <FormControl>
                                                <Textarea className="border-black text-black" placeholder="" {...field} />
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
                                {addMemberLoading ? (
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
                <motion.div onClick={() => setClicked(false)} layout className={`rounded-lg flex-1 bg-[url('./assets/images/grain.jpg')] bg-cover`}>
                    <div className="w-full h-full bg-myPrimary-200/90 rounded-lg p-9">
                        <motion.div>
                            <motion.h2 layout="position" className=" text-xl font-medium text-slate-50 mb-5">
                                Current Proposals
                            </motion.h2>
                            <Separator className="bg-customSlate-700 mb-6" />

                            {proposalData.map((proposal) => (
                                <motion.div layout className="w-full rounded-lg border border-customSlate-300 mb-3 p-5">
                                    <p>{proposal.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default MyProposals;