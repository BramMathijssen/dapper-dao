
import { ConnectKitButton } from "connectkit";
import logo from "./../../assets/logo.svg";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        
        <nav className="mx-auto max-w-7xl flex w-full  pt-6 mb-16" aria-label="Main">
            <ul className="flex flex-row w-full gap-12 items-center">
                <li className="mr-auto">
                    <NavLink to={"/"}>
                        <img src={logo} />
                    </NavLink>
                </li>
                <li className="">
                    <NavLink className={(navData) => (navData.isActive ? "bg-accent2 py-[7px] px-3 rounded-full text-myPrimary-400 text-sm" : "text-customSlate-50 hover:text-customSlate-200")} to={"/"}>
                        Dashboard
                    </NavLink>
                </li>
                <li className="">
                    <NavLink className={(navData) => (navData.isActive ? "bg-accent2 py-[7px] px-3 rounded-full text-myPrimary-400 text-sm" : "text-customSlate-50 hover:text-customSlate-200")} to={"/members"}>
                        Members
                    </NavLink>
                </li>
                <li className="">
                    <NavLink className={(navData) => (navData.isActive ? "bg-accent2 py-[7px] px-3 rounded-full text-myPrimary-400 text-sm" : "text-customSlate-50 hover:text-customSlate-200")} to={"/proposals"}>
                        Proposals
                    </NavLink>
                </li>
                <li className="ml-auto">
                    <ConnectKitButton
                        customTheme={{
                            "--ck-connectbutton-color": "#ffffff",
                            "--ck-connectbutton-background": "rgb(51 65 85)",
                            "--ck-connectbutton-border-radius": "6px",
                            "--ck-connectbutton-font-weight": "400",
                        }}
                    />
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
