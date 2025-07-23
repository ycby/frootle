import {
    TransactionData,
    TransactionDataBE,
    NewTransactionInputs,
    DiaryEntryData, DiaryEntryBE
} from "#root/src/routes/portfolio-diary/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";

const convertFEtoBETransaction:(sourceObj: NewTransactionInputs) => TransactionDataBE = (sourceObj: NewTransactionInputs): TransactionDataBE  => {

    return {
        stock_id: sourceObj.stockId,
        type: sourceObj.type,
        amount: Number(sourceObj.amtWOFee),
        quantity: Number(sourceObj.quantity),
        fee: Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee),
        amount_per_share: Number(sourceObj.amtWOFee) / Number(sourceObj.quantity),
        transaction_date: sourceObj.transactionDate,
        currency: sourceObj.currency
    };
}

const convertBEtoFETransaction: (data: TransactionDataBE) => TransactionData = (data: TransactionDataBE): TransactionData => {

    return {
        id: data.id,
        stockId: data.stock_id,
        type: data.type,
        amount: data.amount,
        quantity: data.quantity,
        fee: data.fee,
        amountPerShare: data.amount_per_share,
        transactionDate: new Date(data.transaction_date),
        currency: data.currency,
    };
}

const convertFEtoBEDiaryEntry:(sourceObj: DiaryEntryData) => DiaryEntryBE = (sourceObj: DiaryEntryData): DiaryEntryBE  => {

    return {
        stock_id: sourceObj.stockId,
        title: sourceObj.title,
        content: sourceObj.content,
        posted_date: dateToStringConverter(sourceObj.postedDate)
    };
}

const capitaliseWord: (word: string) => string = (word: string): string => {

    return word.charAt(0).toUpperCase() + word.slice(1);
}

export {
    convertFEtoBETransaction,
    convertBEtoFETransaction,
    convertFEtoBEDiaryEntry,
    capitaliseWord
}