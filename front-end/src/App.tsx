import { useState } from "react";
import "./App.css";
import Layout from "./components/layout/Layout";
import { Button } from "./components/ui/button";
import { CONTRACTS, getContractAddressByChain } from "./lib/getContractAddressByChain";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form";
import { Input } from "./components/ui/input";

function App() {
    const [clicked, setClicked] = useState<boolean>(false);

    const buttonHandler = () => {
        console.log(`click`);
        setClicked(true);
    };

    const test = getContractAddressByChain(31337, CONTRACTS.DAO_CONTRACT);
    console.log(test);

    const formSchema = z.object({
        username: z.string().min(2).max(50),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
        mode: "all",
    });
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
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
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>This is your public display name.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
            <Layout>
                <Button onClick={buttonHandler}>Submit</Button>
                <div className="container max-w-6xl mx-auto bg-slate-600">
                    <div className="grid gap-4 grid-cols-2 ">
                        <div className="bg-red-100 p-5 font-inter">item 1</div>
                        <div className="bg-red-100 p-5 font-poppins">item 1</div>
                        <div className="bg-red-100 p-5">item 1</div>
                        <div className="bg-red-100 p-5">item 1</div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-1 mt-1">Hey</h1>
                        <h1 className=" text-xl font-semibold">Hey</h1>
                        <h2>Hey</h2>
                    </div>
                </div>
                <div className="container max-w-6xl mx-auto mt-10 bg-slate-200">
                    <div className="flex gap-4 grid-cols-2">
                        <div className="bg-red-100 p-5 flex-[0.5_0.5_0%]">item 1</div>
                        <div className="bg-red-100 p-5 w-1.5">item 1</div>
                    </div>
                </div>
                <div className="container max-w-6xl mx-auto mt-10 bg-slate-200 h-96">
                    <div className="flex gap-4 place-content-center h-full">
                        <div className="bg-red-100 p-5 flex-[0.5_0.5_0%] h-20">item 1</div>
                        <div className="bg-red-100 p-5 w-1.5 h-20">item 1</div>
                    </div>
                </div>
                <div className="container max-w-6xl mt-10 bg-slate-200 h-96">
                    <div className="grid grid-cols-2 place-items-center h-full bg-green-900">
                        <div className=" bg-green-200 w-20">01</div>
                        <div className=" bg-green-200 w-20">01</div>
                        <div className=" bg-green-200 w-20">01</div>
                        <div className=" bg-green-200 w-20">01</div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default App;
