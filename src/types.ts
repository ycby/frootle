//=====================================================================================
//API Related
//=====================================================================================

const APIStatus = {
    SUCCESS: 'success',
    FAIL: 'fail'
} as const;

export interface APIResponse<T> {
    status: APIStatusKeys;
    data: T;
}

export interface PaginationResponse<T> {
    total_rows: string;
    data: T[];
    offset: number;
    limit: number;
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
    CASH_DIVIDEND: 'cash_dividend',
    SCRIP_DIVIDEND: 'scrip_dividend',
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

export interface NewItemView<T> {
    sourceObject: T;
    updateSource: (sourceObject: T) => void;
}

export type ComponentStatusKeys = typeof ComponentStatus[keyof typeof ComponentStatus];

export {
    APIStatus,
    Currency,
    TransactionType,
    ComponentStatus,
}
