import {NewTransactionInputs, TransactionData, TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse, APIStatus, TransactionType} from "#root/src/types.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/transaction`;

const transactionMapperBE = (sourceObj: NewTransactionInputs): Partial<TransactionDataBE>  => {

    const result: Partial<TransactionDataBE> = {
        type: sourceObj.type,
        amount: Number(sourceObj.amtWOFee),
        quantity: sourceObj.type === TransactionType.CASH_DIVIDEND ? 0 : Number(sourceObj.quantity),
        fee: Math.abs(Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee)),
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
        amount: Number(data.amount).toFixed(2),
        quantity: data.quantity,
        fee: Number(data.fee).toFixed(2),
        amountPerShare: Number(data.amount_per_share).toFixed(2),
        transactionDate: new Date(data.transaction_date),
        currency: data.currency,
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