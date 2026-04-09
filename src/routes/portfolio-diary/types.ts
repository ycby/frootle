import {ComponentStatusKeys, CurrencyKeys, TransactionTypeKeys} from "#root/src/types.ts";
import Money from "money-type";

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
    createdDatetime?: Date;
    lastModifiedDatetime?: Date;
}

export type StockDataBE = {
    id: string;
    ticker_no: string;
    name: string;
    full_name?: string;
    is_active: boolean;
    created_datetime: Date;
    last_modified_datetime: Date;
}

export type ShortData = {
    id: string;
    stockId?: string;
    shortedShares: number;
    shortedAmount: Money;
    reportingDate: Date;
    tickerNo?: string;
    name?: string;
    createdDatetime?: Date;
    lastModifiedDatetime?: Date;
}

export type ShortDataBE = {
    id: string;
    stock_id?: string;
    shorted_shares: number;
    shorted_amount: Money;
    reporting_date: string;
    ticker_no: string;
    created_datetime: Date;
    last_modified_datetime: Date;
}

export type TransactionData = {
    id: string | null;
    stockId: string | null;
    type: TransactionTypeKeys;
    amount: Money;
    amountPerShare: string;
    quantity: number;
    fee: Money;
    transactionDate: Date;
    currency: CurrencyKeys;
    createdDatetime?: Date;
    lastModifiedDatetime?: Date;
}

export type TransactionDataBE = {
    id: string;
    stock_id: string;
    type: TransactionTypeKeys;
    amount: Money;
    amount_per_share: number;
    quantity: number;
    fee: Money;
    transaction_date: string;
    currency: CurrencyKeys;
    created_datetime: Date;
    last_modified_datetime: Date;
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
    id: string | null;
    stockId: string | null;
    title: string;
    content: string;
    postedDate: Date;
    createdDatetime?: Date;
    lastModifiedDatetime?: Date;
}

export type DiaryEntryBE = {
    id: string;
    stock_id: string;
    title: string;
    content: string;
    posted_date: Date;
    created_datetime: Date;
    last_modified_datetime: Date;
}