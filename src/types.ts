//=====================================================================================
//API Related
//=====================================================================================

const APIStatus = {
    SUCCESS: 'success',
    FAIL: 'fail'
} as const;

export interface APIResponse <T>{
    status: APIStatusKeys;
    data: T;
}

export type APIStatusKeys = typeof APIStatus[keyof typeof APIStatus];
//=====================================================================================
//Stock Specific
//=====================================================================================
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
const DividendType = {
    CASH: 'CASH',
    SCRIP: 'SCRIP',
}

export type CurrencyKeys = typeof Currency[keyof typeof Currency];
export type TransactionTypeKeys = typeof TransactionType[keyof typeof TransactionType];
export type DividendTypeKeys = typeof DividendType[keyof typeof DividendType];

//=====================================================================================
//General
//=====================================================================================
const ComponentStatus = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete'
} as const;

export interface NewItemView<T> {
    sourceObject: T;
    updateSource: (sourceObject: T) => void;
}

export type ComponentStatusKeys = typeof ComponentStatus[keyof typeof ComponentStatus];

export {
    APIStatus,
    Currency,
    TransactionType,
    DividendType,
    ComponentStatus,
}
