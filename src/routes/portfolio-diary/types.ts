import {CurrencyKeys, TransactionTypeKeys} from "#root/src/types.ts";

export interface StockData {
    id: number;
    ticker_no: string;
    name: string;
    full_name?: string;
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
    amtWFee: string;
    amtWOFee: string;
    quantity: string;
    transactionDate: string;
    currency: CurrencyKeys;
}

export interface DiaryEntryData {
    id: number,
    stockId: number,
    title: string,
    content: string,
    postedDate: Date
}