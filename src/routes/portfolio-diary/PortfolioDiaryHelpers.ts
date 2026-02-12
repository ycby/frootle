import {
    TransactionData,
    NewTransactionInputs
} from "#root/src/routes/portfolio-diary/types.ts";
import {dateToStringConverter, stringToDateConverter} from "#root/src/helpers/DateHelpers.ts";
import {TransactionType} from "#root/src/types.ts";

const convertTransactionToNewTransaction:(sourceObj: TransactionData) => NewTransactionInputs = (sourceObj: TransactionData): NewTransactionInputs => {

    return {
        id: sourceObj.id,
        stockId: sourceObj.stockId,
        type: sourceObj.type,
        amtWFee: (Number(sourceObj.amount) + Number(sourceObj.fee)).toFixed(2),
        amtWOFee: Number(sourceObj.amount).toFixed(2),
        quantity: sourceObj.quantity.toString(),
        transactionDate: dateToStringConverter(sourceObj.transactionDate),
        currency: sourceObj.currency
    }
}

//TODO: Temp while I convert to using cent base
const convertNewTransactionToTransaction = (sourceObj: NewTransactionInputs): TransactionData => {

    const result = {
        id: sourceObj.id,
        stockId: sourceObj.stockId,
        type: sourceObj.type,
        amount: Number(sourceObj.amtWOFee).toFixed(2),
        amountPerShare: (Number(sourceObj.amtWOFee) / Number(sourceObj.quantity)).toFixed(2),
        quantity: sourceObj.type === TransactionType.CASH_DIVIDEND ? 0 : Number(sourceObj.quantity),
        fee: Math.abs(Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee)).toFixed(2),
        transactionDate: stringToDateConverter(sourceObj.transactionDate),
        currency: sourceObj.currency
    }

    return <TransactionData>result;
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
    convertTransactionToNewTransaction,
    convertNewTransactionToTransaction,
    capitaliseWord,
    replaceUnderscoreWithSpace,
    getRandomNumber
}