export const formatTimestamp = (timestamp: bigint): string => {
    const numberTimestamp = Number(timestamp);
    const date = new Date(numberTimestamp * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
    return formattedDate;
};
