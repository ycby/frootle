import {ComponentStatusKeys, CurrencyKeys, TransactionTypeKeys} from "#root/src/types.ts";

export type ListItem = {
    index: number;
    status: ComponentStatusKeys
}

export type StockData = {
    id: string;
    tickerNo: string;
    name: string;
    full_name?: string;
    isActive: boolean;
}

export type StockDataBE = {
    id: string;
    ticker_no: string;
    name: string;
    full_name?: string;
    is_active: boolean;
}

export type ShortData = {
    id: string;
    stockId?: string;
    shortedShares: number;
    shortedAmount: number;
    reportingDate: Date;
    tickerNo?: string;
    name?: string;
}

export type ShortDataBE = {
    id: string;
    stock_id?: string;
    shorted_shares: number;
    shorted_amount: number;
    reporting_date: string;
    ticker_no: string;
}

export type TransactionData = {
    id: string | null;
    stockId: string | null;
    type: TransactionTypeKeys;
    amount: string;
    amountPerShare: string;
    quantity: number;
    fee: string;
    transactionDate: Date;
    currency: CurrencyKeys;
}

export type TransactionDataBE = {
    id: string;
    stock_id: string;
    type: TransactionTypeKeys;
    amount: number;
    amount_per_share: number;
    quantity: number;
    fee: number;
    transaction_date: string;
    currency: CurrencyKeys;
}

export type NewTransactionInputs = {
    id: string | null;
    stockId: string | null;
    type: TransactionTypeKeys;
    amtWFee: string;
    amtWOFee: string;
    quantity: string;
    transactionDate: string;
    currency: CurrencyKeys;
}

export type DiaryEntry = {
    id: string | null,
    stockId: string | null,
    title: string,
    content: string,
    postedDate: Date
}

export type DiaryEntryBE = {
    id: string,
    stock_id: string,
    title: string,
    content: string,
    posted_date: string
}