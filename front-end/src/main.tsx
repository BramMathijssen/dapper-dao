import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { goerli, hardhat } from "@wagmi/core/chains";
import { ConnectKitProvider } from "connectkit";

import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster.js";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, publicClient, webSocketPublicClient } = configureChains([goerli, hardhat, mainnet], [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]);

// Set up wagmi config
const config = createConfig({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new InjectedConnector({
            chains,
            options: {
                name: "Injected",
                shimDisconnect: true,
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <WagmiConfig config={config}>
        <ConnectKitProvider
            mode="light"
            customTheme={{
                "--ck-accent-color": "rgb(15 23 42)",
                "--ck-accent-text-color": "#ffffff",
            }}
        >
            <BrowserRouter>
                <App />
                <Toaster />
            </BrowserRouter>
        </ConnectKitProvider>
    </WagmiConfig>
);
