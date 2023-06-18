import { useState } from "react";
import { useContractRead } from "wagmi";

export const useMemberData2 = (membersList, contract, abi, functionName) => {
    const [list, setList] = useState([]);

    for (let i = 0; i < membersList.length; i++) {
        const { data: member } = useContractRead({
            address: contract,
            abi: abi,
            functionName: functionName,
            args: [membersList[i]],

            onSuccess(data) {
                console.log(data);
                setList(prev => [...prev, data]);
            },
        });
    }

    return list;
}

function MyComponent() {
    const members = useMemberData();

    return (
        <div>
            {members.map((member) => (
                <div key={member.address}>
                    {member.name} ({member.address})
                </div>
            ))}
        </div>
    );
}
