import React from "react";
import Navigation from "./Navigation";
import { AlertTriangle } from "lucide-react";
import { useAccount } from "wagmi";

const Layout = (props: any) => {
    const { isConnected } = useAccount();
    return (
        <>
            {!isConnected ? (
                <div className="bg-customSlate-600 h-7 w-full flex flex-row gap-1 justify-center items-center">
                    <AlertTriangle aria-label="downvote" className="h-5 w-5" />
                    <p className="text-sm">Connect your wallet to see data</p>
                </div>
            ) : null}
            <div className="flex flex-col h-screen bg-myPrimary-400 pl-12 pr-12">
                <Navigation />
                <main className="bg-myPrimary-400 grow">
                    <div className="mx-auto max-w-7xl h-full">{props.children}</div>
                </main>
            </div>
        </>
    );
};

export default Layout;
