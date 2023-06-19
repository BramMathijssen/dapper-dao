import { useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import { Button } from "./components/ui/button";

function App() {
    const [clicked, setClicked] = useState<boolean>(false);

    const buttonHandler = () => {
        setClicked(true);
    };

    return (
        <>
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
