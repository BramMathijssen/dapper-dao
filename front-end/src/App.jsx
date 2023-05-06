import { useState } from "react";
import { TextField, Label, Input } from "react-aria-components";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import ConnectButton from "./components/layout/ConnectButton";
import { contractAddresses, daoContractAbi } from "./constants";
import { ethers } from "ethers";

import "./assets/styles/main.scss";
import "./App.css";

function App() {
    const [memberName, setMemberName] = useState("");
    const [memberAddress, setMemberAddress] = useState("");
    const [memberRole, setMemberRole] = useState("");

    console.log(contractAddresses[31337]["daoContract"][0]);

    console.log(memberName);

    const { config } = usePrepareContractWrite({
        address: contractAddresses[31337]["daoContract"][0],
        abi: daoContractAbi,
        functionName: "addMember",
        args: [memberAddress, ethers.utils.formatBytes32String(memberName), memberRole],
    });

    const { data, isLoading, isSuccess, write } = useContractWrite(config);

    const submitHandler = (e) => {
        e.preventDefault();
        write?.();
    };
    return (
        <>
            <div className="connect">
                <ConnectButton />
            </div>
            <h1>DAO-DAPP</h1>
            <div className="grid-container">
                <div className="add-member">
                    <form onSubmit={submitHandler}>
                        <label>Name</label>
                        <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)}></input>
                        <label>Address</label>
                        <input type="text" value={memberAddress} onChange={(e) => setMemberAddress(e.target.value)}></input>
                        <label>Role</label>
                        <input type="number" value={memberRole} onChange={(e) => setMemberRole(e.target.value)}></input>
                        {/* <TextField>
                            <Label>member address: </Label>
                            <Input />
                        </TextField>
                        <TextField>
                            <Label>member name: </Label>
                            <Input />
                        </TextField>
                        <TextField>
                            <Label>member role: </Label>
                            <Input />
                        </TextField> */}
                        <button type="submit">Add Member</button>
                    </form>
                </div>
                <div className="proposals">wadup</div>
            </div>
        </>
    );
}

export default App;
