import { useContractRead } from "wagmi";

function useMemberData() {
    const membersList = useContractRead({
        address: contractAddresses[31337]["daoContract"][0],
        abi: daoContractAbi,
        functionName: "getMembersList",
        args: [],
        enabled: false,
    });

    for (const i = 0; i < membersList.data.length; i++) {
        const { data: member } = useContractRead({
            address: contractAddresses[31337]["daoContract"][0],
            abi: daoContractAbi,
            functionName: "getMember",
            args: [memberAddress],
        });
        return member;
    }

    return memberData;
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
