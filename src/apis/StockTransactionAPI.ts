import {TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = 'http://localhost:3000/transaction';

const getStockTransactions = async (stockId: number): Promise<any[]> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    if (!response.ok) return [];

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return [];

    return responseJSON.data;
}

const getStocksWithTransactions = async (): Promise<any[]> => {

    const response = await fetch(`${baseUrl}/stocks`, {
        method: 'GET'
    });

    if (!response.ok) return [];

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return [];

    return responseJSON.data;
}

const postStockTransactions = async (data: TransactionDataBE | TransactionDataBE[]) => {

    const processedData = data instanceof Array ? data : [data];

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.status === 1;


}

const putStockTransaction = async (id: number, data: TransactionDataBE) => {

    const processedData = {...data, id: id}

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.status === 1;
}

const deleteStockTransaction = async (id: number):Promise<Boolean> => {

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.data.status === 'success';
}

export {
    getStockTransactions,
    getStocksWithTransactions,
    postStockTransactions,
    putStockTransaction,
    deleteStockTransaction,
};