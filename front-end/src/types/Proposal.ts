interface Proposal{
    active: boolean,
    creator: string,
    description: string,
    downvotes: number,
    endDate: number,
    id: bigint,
    startDate: number,
    title: string,
    upVotes: number,
    valid: boolean,
    voteCount: number,
    voters: string[]
}