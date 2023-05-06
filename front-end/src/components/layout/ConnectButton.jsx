import { ConnectKitButton } from "connectkit";

const ConnectButton = () => {
    return (
        <>
            <ConnectKitButton
                className="button"
                customTheme={{
                    "--ck-connectbutton-color": "#27292F",
                    "--ck-connectbutton-background": "#F3EF52",
                }}
            />
        </>
    );
};

export default ConnectButton;
