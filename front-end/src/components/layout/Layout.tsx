import React from "react";
import Navigation from "./Navigation";

const Layout = (props: any) => {
    return (
        <div className="flex flex-col h-screen">
            <Navigation />
            <main className="bg-myPrimary-400 grow p-12">
                <div className="mx-auto max-w-7xl h-full">{props.children}</div>
            </main>
        </div>
    );
};

export default Layout;
