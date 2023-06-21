import React from "react";
import { ConnectKitButton } from "connectkit";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "../ui/navigation-menu"

const Navigation = () => {
    return (
        <div>
            <nav className="flex items-center justify-between p-4 lg:px-8 bg-myPrimary-400" aria-label="Global">
                <div className="flex lg:flex-1 ">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Your Company</span>
                        <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                    </a>
                </div>
                <div className="flex lg:hidden"></div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <ConnectKitButton
                        customTheme={{
                            "--ck-connectbutton-color": "#ffffff",
                            "--ck-connectbutton-background": "rgb(51 65 85)",
                            "--ck-connectbutton-border-radius": "6px",
                            "--ck-connectbutton-font-weight": "400",
                        }}
                    />
                </div>
            </nav>
        </div>
        // <NavigationMenu>
        //     <NavigationMenuList>
        //         <NavigationMenuItem>
        //             <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
        //             <NavigationMenuContent>
        //                 <NavigationMenuLink>Link</NavigationMenuLink>
        //             </NavigationMenuContent>
        //         </NavigationMenuItem>
        //         <NavigationMenuItem>
        //             <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
        //             <NavigationMenuContent>
        //                 <NavigationMenuLink>Link</NavigationMenuLink>
        //             </NavigationMenuContent>
        //         </NavigationMenuItem>
        //     </NavigationMenuList>
        // </NavigationMenu>
    );
};

export default Navigation;
