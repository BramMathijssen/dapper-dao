import React, { useState } from "react";
import Layout from "../layout/Layout";
import { Address, useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "../../lib/getContractAddressByChain";
import { daoContractAbi } from "../../constants";
import { Button } from "../ui/button";
import { hexToString, stringToHex } from "viem";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { formatTimestamp } from "../../lib/formatTimestamp";

const MyMembers = () => {
    const { chain } = useNetwork();
    const [clicked, setClicked] = useState<boolean>(false);

    const transform = (data: any) => {
        const transformedArray = data[0].map((value: any, index: any) => ({
            address: data[0][index],
            valid: data[1][index],
            name: data[2][index],
            memberSince: data[3][index],
        }));

        // sorts array so latest added array is first
        const sortedArray = transformedArray.sort((a: any, b: any) => Number(b.memberSince) - Number(a.memberSince));
        return sortedArray;
    };

    const {
        data: memberData,
        isError: error3,
        isLoading: loading3,
        refetch: refetchMembers,
    } = useContractRead({
        address: getContractAddressByChain(chain?.id, CONTRACTS.DAO_CONTRACT),
        abi: daoContractAbi,
        functionName: "getMembers",
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
        functionName: "addMember",

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

    const onFormSubmitHandler = (memberAddress: Address, memberName: string, memberRole: number) => {
        write({
            args: [memberAddress, stringToHex(memberName, { size: 32 }), memberRole],
        });
    };

    const formSchema = z.object({
        username: z.string().min(2).max(50),
        role: z.string().min(1).max(50),
        address: z.string().min(1).max(50),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            role: "",
            address: "",
        },
        mode: "all",
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
        write({
            args: [values.address, stringToHex(values.username, { size: 32 }), values.role],
        });
    }

    return (
        <Layout>
            <div className="flex flex-row gap-2 h-full">
                {/* <motion.div onClick={() => setClicked(false)} layout className="flex-1 border-white border rounded p-2">
                            <motion.div layout>
                                <Label>Hey</Label>
                                <Input />
                            </motion.div>
                        </motion.div>
                        <motion.div onClick={() => setClicked(true)} layout className={`bg-black ${clicked ? "flex-[1]" : "flex-[0.5]"} `}>
                            <motion.div layout>
                                <p>HEY</p>
                            </motion.div>
                        </motion.div> */}
                <motion.div onClick={() => setClicked(true)} layout className={`${clicked ? "flex-[0.6]" : "flex-[0.35]"} bg-accent2 rounded-lg p-9`}>
                    <motion.div layout="position">
                        <h2 className=" text-xl font-medium text-slate-900 mb-7">Create a Member</h2>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Username</FormLabel>
                                            <FormControl>
                                                <Input className="border-black text-black" placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Address</FormLabel>
                                            <FormControl>
                                                <Input className="border-black text-black" placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-black">Role</FormLabel>
                                            <motion.div layout>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="border-black text-black">
                                                            <SelectValue placeholder="Select a verified email to display" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="0">User</SelectItem>
                                                        <SelectItem value="1">Admin</SelectItem>
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
                                        ADD
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
                                Registered Members
                            </motion.h2>
                            <Separator className="bg-customSlate-700 mb-6" />

                            {memberData ? (
                                memberData.map((member: any) => (
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
                                ))
                            ) : (
                                <p>No members found</p>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default MyMembers;
