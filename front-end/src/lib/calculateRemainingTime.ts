export function calculateRemainingTime(timestamp: number): { days: number; hours: number; minutes: number } {
    const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    const remainingSeconds = timestamp - now;
  
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);
  
    return { days, hours, minutes };
  }