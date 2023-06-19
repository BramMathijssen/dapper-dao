import React from "react";
import Navigation from "./Navigation";

const Layout = (props: any) => {
    return (
        <div>
            <Navigation />
            <main>
                <div className="mx-auto max-w-7xl bg-slate-500">{props.children}</div>
            </main>
        </div>
    );
};

export default Layout;
