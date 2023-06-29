import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { CONTRACTS, getContractAddressByChain } from "../../lib/getContractAddressByChain";
import { daoContractAbi } from "../../constants";
import { Button } from "../ui/button";
import { stringToHex } from "viem";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const AddMemberForm = ({ refetchMembers }: any) => {
    const { toast } = useToast();
    const { chain } = useNetwork();

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
        onError(error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
        },
    });

    const {isLoading: waitAddMemberLoading} = useWaitForTransaction({
        hash: addMemberData?.hash,
        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchMembers();
            toast({
                variant: "custom",
                title: "Success",
                description: "Successfully Added a new Member",
            });
        },
    });

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
        <>
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
                    {addMemberLoading || waitAddMemberLoading ? (
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
        </>
    );
};

export default AddMemberForm;
