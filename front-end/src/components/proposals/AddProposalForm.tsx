
import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
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
import { Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

const AddProposalForm = ({refetchProposals} : any) => {
    const { chain } = useNetwork();
    const {toast} = useToast();

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
        onError(error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request.",
            });
        },
    });

    const {isLoading: addMemberWaitLoading} = useWaitForTransaction({
        hash: addMemberData?.hash,
        onSuccess(data) {
            console.log(`successfully waited..`);
            console.log(data);
            refetchProposals();
            toast({
                variant: "custom",
                title: "Success",
                description: "Successfully Added a new Proposal",
            });
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
                {addMemberLoading || addMemberWaitLoading  ? (
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
    );
};

export default AddProposalForm;
