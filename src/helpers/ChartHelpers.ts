const convertZeroesToKorM = (value: number, largestValue: number): string => {

    if (value === 0) return '0';
    const largestValueStr = largestValue.toString();

    let denomination = '';
    if (largestValueStr.length > 9) denomination = 'B'
    else if (largestValueStr.length > 6) denomination = 'M'
    else if (largestValueStr.length > 3) denomination = 'k'
    else denomination = '';

    switch (denomination) {
        case 'B':
            return (value / 1e9).toString() + denomination;
        case 'M':
            return (value / 1e6).toString() + denomination;
        case 'k':
            return (value / 1e3).toString() + denomination;
        default:
            return value.toString();
    }
}

export {
    convertZeroesToKorM,
}