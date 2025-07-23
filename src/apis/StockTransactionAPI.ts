import {TransactionData, TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import {APIStatus, APIStatusKeys} from "#root/src/types.ts";

const baseUrl = 'http://localhost:3000/transaction';

//map to local format - most transactions will only require checking status
//{ status, data }

interface StockTransactionAPIResponse {
    status: APIStatusKeys;
    data: TransactionData[];
}

const getStockTransactions = async (stockId: number): Promise<StockTransactionAPIResponse> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: [],
    } as StockTransactionAPIResponse;

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: [],
    } as StockTransactionAPIResponse;

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    };
}

const getStocksWithTransactions = async (): Promise<StockTransactionAPIResponse> => {

    const response = await fetch(`${baseUrl}/stocks`, {
        method: 'GET'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: [],
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    };
}

const postStockTransactions = async (data: TransactionDataBE | TransactionDataBE[]): Promise<StockTransactionAPIResponse> => {

    const processedData = data instanceof Array ? data : [data];

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
        data: [],
    };
}

const putStockTransaction = async (id: number, data: TransactionDataBE): Promise<StockTransactionAPIResponse> => {

    const processedData = {...data, id: id}

    const response = await fetch(`${baseUrl}/${id}`, {
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

const deleteStockTransaction = async (id: number): Promise<StockTransactionAPIResponse> => {

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
    getStocksWithTransactions,
    postStockTransactions,
    putStockTransaction,
    deleteStockTransaction,
};