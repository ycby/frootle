import {
    TransactionData,
    TransactionDataBE,
    NewTransactionInputs
} from "#root/src/routes/portfolio-diary/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {TransactionType} from "#root/src/types.ts";

const convertFEtoBETransaction:(sourceObj: NewTransactionInputs) => TransactionDataBE = (sourceObj: NewTransactionInputs): TransactionDataBE  => {

    const result: TransactionDataBE = {
        stock_id: sourceObj.stockId,
        type: sourceObj.type,
        amount: Number(sourceObj.amtWOFee),
        quantity: sourceObj.type === TransactionType.CASH_DIVIDEND ? 0 : Number(sourceObj.quantity),
        fee: Math.abs(Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee)),
        amount_per_share: Number(sourceObj.amtWOFee) / Number(sourceObj.quantity),
        transaction_date: sourceObj.transactionDate,
        currency: sourceObj.currency
    };

    if (sourceObj?.id) result.id = sourceObj.id;

    return result;
}

const convertBEtoFETransaction: (data: TransactionDataBE) => TransactionData = (data: TransactionDataBE): TransactionData => {

    return {
        id: data.id,
        stockId: data.stock_id,
        type: data.type,
        amount: Number(data.amount).toFixed(2),
        quantity: data.quantity,
        fee: Number(data.fee).toFixed(2),
        amountPerShare: Number(data.amount_per_share).toFixed(2),
        transactionDate: new Date(data.transaction_date),
        currency: data.currency,
    };
}

const convertTransactionToNewTransaction:(sourceObj: TransactionData) => NewTransactionInputs = (sourceObj: TransactionData): NewTransactionInputs => {

    const result: NewTransactionInputs = {
        stockId: sourceObj.stockId,
        type: sourceObj.type,
        amtWFee: (Number(sourceObj.amount) + Number(sourceObj.fee)).toFixed(2),
        amtWOFee: Number(sourceObj.amount).toFixed(2),
        quantity: sourceObj.quantity.toString(),
        transactionDate: dateToStringConverter(sourceObj.transactionDate),
        currency: sourceObj.currency
    }

    if (sourceObj?.id) result.id = sourceObj.id;

    return result;
}

const capitaliseWord: (word: string) => string = (word: string): string => {

    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

const replaceUnderscoreWithSpace: (sentence: string) => string = (sentence: string): string => {

    return sentence.replaceAll('_', ' ');
}

const getRandomNumber: (max: number) => number = (max: number): number => {

    return Math.floor(Math.random() * max);
}
export {
    convertFEtoBETransaction,
    convertBEtoFETransaction,
    convertTransactionToNewTransaction,
    capitaliseWord,
    replaceUnderscoreWithSpace,
    getRandomNumber
}