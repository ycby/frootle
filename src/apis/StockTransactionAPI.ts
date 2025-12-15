import {TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse, APIStatus} from "#root/src/types.ts";

const baseUrl = 'https://localhost:3000/transaction';

//map to local format - most transactions will only require checking status
//{ status, data }

const getStockTransactions = async (stockId: number): Promise<APIResponse<TransactionDataBE[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: [],
    } as APIResponse<TransactionDataBE[]>;

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: [],
    } as APIResponse<TransactionDataBE[]>;

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    };
}

const postStockTransactions = async (data: TransactionDataBE | TransactionDataBE[]): Promise<APIResponse<any[]>> => {

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
        data: responseJSON.data.map((d: any) => d.insertId),
    };
}

const putStockTransaction = async (id: number, data: TransactionDataBE): Promise<APIResponse<any[]>> => {

    const processedData = {...data, id: id}

    console.log(processedData)

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

const deleteStockTransaction = async (id: number): Promise<APIResponse<any[]>> => {

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