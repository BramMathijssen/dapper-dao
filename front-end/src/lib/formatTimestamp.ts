export const formatTimestamp = (timestamp: bigint): string => {
    const numberTimestamp = Number(timestamp);
    const date = new Date(numberTimestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    return formattedDate;
};

export const formatTimestamp2 = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert to milliseconds
  
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${day} ${month} ${hours}:${minutes}`;
  }
