import {NewTransactionInputs, TransactionData, TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse, APIStatus, TransactionType} from "#root/src/types.ts";
import Money from "money-type";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/transaction`;

const transactionMapperBE = (sourceObj: NewTransactionInputs): Partial<TransactionDataBE>  => {

    console.log(Number(sourceObj.amtWOFee));
    console.log(Number(sourceObj.amtWFee));
    console.log(Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee));
    const result: Partial<TransactionDataBE> = {
        type: sourceObj.type,
        amount: Money.fromNominalValue(Number(sourceObj.amtWOFee), 2, sourceObj.currency),
        quantity: sourceObj.type === TransactionType.CASH_DIVIDEND ? 0 : Number(sourceObj.quantity),
        fee: Money.fromNominalValue(Math.abs(Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee)), 2, sourceObj.currency),
        amount_per_share: Number(sourceObj.amtWOFee) / Number(sourceObj.quantity),
        transaction_date: sourceObj.transactionDate,
        currency: sourceObj.currency
    };

    if (sourceObj.id !== null) result.id = sourceObj.id;
    if (sourceObj.stockId !== null) result.stock_id = sourceObj.stockId;

    return result;
}

const transactionMapperFE = (data: TransactionDataBE): TransactionData => {

    return {
        id: data.id,
        stockId: data.stock_id,
        type: data.type,
        amount: new Money(BigInt(data.amount.whole), data.amount.decimal_places, data.amount.iso_code),
        quantity: data.quantity,
        fee: new Money(BigInt(data.fee.whole), data.fee.decimal_places, data.fee.iso_code),
        amountPerShare: Number(data.amount_per_share).toFixed(2),
        transactionDate: new Date(data.transaction_date),
        currency: data.currency,
        createdDatetime: data.created_datetime,
        lastModifiedDatetime: data.last_modified_datetime,
    };
}

const getStockTransactions = async (stockId: string): Promise<APIResponse<TransactionData[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: [],
    };

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: [],
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data.map((element: TransactionDataBE) => transactionMapperFE(element))
    };
}

const postStockTransactions = async (data: NewTransactionInputs | NewTransactionInputs[]): Promise<APIResponse<any[]>> => {

    const processedData = data instanceof Array
        ? data.map(element => transactionMapperBE(element))
        : [transactionMapperBE(data)];

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 1 ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: responseJSON.data.map((d: any) => d.insertId),
    };
}

const putStockTransaction = async (data: NewTransactionInputs | NewTransactionInputs[]): Promise<APIResponse<any[]>> => {

    const processedData = data instanceof Array
        ? data.map(element => transactionMapperBE(element))
        : [transactionMapperBE(data)];

    console.log(processedData)

    const response = await fetch(`${baseUrl}/`, {
        method: 'PUT',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: [],
    };

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 1 ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

const deleteStockTransaction = async (id: string): Promise<APIResponse<any[]>> => {

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    return {
        status: responseJSON.data.status === 'success' ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

export {
    getStockTransactions,
    postStockTransactions,
    putStockTransaction,
    deleteStockTransaction,
};