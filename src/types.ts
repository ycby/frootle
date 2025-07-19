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
//General
//=====================================================================================
const ComponentStatus = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
} as const;

export type ComponentStatusKeys = typeof ComponentStatus[keyof typeof ComponentStatus];

export {
    Currency,
    TransactionType,
    ComponentStatus,
}
