const Currency = {
    HKD: 'HKD',
    RMB: 'RMB',
    USD: 'USD',
} as const;
const TransactionType = {
    BUY: 'buy',
    SELL: 'sell',
    DIVIDEND: 'dividend'
} as const;

export type CurrencyKeys = typeof Currency[keyof typeof Currency];
export type TransactionTypeKeys = typeof TransactionType[keyof typeof TransactionType];

//=====================================================================================
//I/O
//=====================================================================================


export {
    Currency,
    TransactionType,
}
