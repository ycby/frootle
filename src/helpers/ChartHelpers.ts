const convertZeroesToKorM = (value: number): string => {

    if (value === 0) return '0';
    const valueStr = value.toString();

    if (value % 1000000000 === 0) return (value.toString().slice(0, valueStr.length - 9)) + 'B';
    if (value % 1000000 === 0) return (value.toString().slice(0, valueStr.length - 6)) + 'M';
    if (value % 1000 === 0) return (value.toString().slice(0, valueStr.length - 3)) + 'k';
    return value.toString();
}

export {
    convertZeroesToKorM,
}