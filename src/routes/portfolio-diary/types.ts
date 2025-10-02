import {CurrencyKeys, DividendTypeKeys, TransactionTypeKeys} from "#root/src/types.ts";

export interface StockData {
    id: number;
    ticker_no: string;
    name: string;
    full_name?: string;
}

export interface ShortData {
    id: number;
    stockId: number;
    shortedShares: number;
    shortedAmount: number;
    reportingDate: Date;
}

export interface TransactionData {
    id?: number,
    stockId: number,
    type: TransactionTypeKeys;
    amount: number;
    amountPerShare: number;
    quantity: number;
    fee: number;
    transactionDate: Date;
    currency: CurrencyKeys;
}

export interface TransactionDataBE {
    id?: number,
    stock_id: number;
    type: TransactionTypeKeys;
    amount: number;
    amount_per_share: number;
    quantity: number;
    fee: number;
    transaction_date: string;
    currency: CurrencyKeys;
}

export interface NewTransactionInputs {
    stockId: number;
    type: TransactionTypeKeys;
    dividendType: DividendTypeKeys | null;
    amtWFee: string;
    amtWOFee: string;
    quantity: string;
    transactionDate: string;
    currency: CurrencyKeys;
}

export interface DiaryEntryData {
    id?: number,
    stockId: number,
    title: string,
    content: string,
    postedDate: Date
}

export interface DiaryEntryBE {
    id?: number,
    stock_id: number,
    title: string,
    content: string,
    posted_date: string
}