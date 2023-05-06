import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/styles/global.scss";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli, hardhat } from "@wagmi/core/chains";
import { ConnectKitProvider } from "connectkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from 'wagmi/providers/public'

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

const { provider, webSocketProvider, chains } = configureChains([goerli, mainnet, hardhat], [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]);

// add new connectors https://wagmi.sh/react/connectors/coinbaseWallet
const client = createClient({
    autoConnect: false,
    connectors: [
        new MetaMaskConnector({
            chains: chains,
            options: {
                shimDisconnect: true,
            },
        }),
        new CoinbaseWalletConnector({
            chains: chains,
            options: {
                appName: "wagmi.sh",
                jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            },
        }),
    ],
    provider,
    webSocketProvider,
});

ReactDOM.createRoot(document.getElementById("root")).render(
    <WagmiConfig client={client}>
        <ConnectKitProvider
            mode="dark"
            customTheme={{
                "--ck-accent-color": "#F3EF52",
                "--ck-accent-text-color": "#ffffff",
            }}
        >
            <App />
        </ConnectKitProvider>
    </WagmiConfig>
);
