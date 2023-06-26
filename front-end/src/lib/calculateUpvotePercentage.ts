export const  calculateUpvotePercentage = (upvotes: number, downvotes: number): number => {
    if (upvotes === 0 && downvotes === 0) {
      return 0; // Avoid division by zero error
    }
    
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = (upvotes / totalVotes) * 100;
    return Math.round(upvotePercentage);
  }