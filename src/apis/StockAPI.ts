import {APIResponse, APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = 'http://localhost:3000/stock';

const getStocksByNameOrTicker = async (queryTerm: string): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}?query_type=OR&name=${queryTerm}&ticker_no=${queryTerm}`, {
        method: 'GET',
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    console.log(responseJSON.data);
    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: []
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    }
}

const getTrackedStocks = async (): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}/tracked`, {
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

const setTrackedStock = async (id: number): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}/tracked/${id}/track`, {
        method: 'POST'
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

const setUntrackedStock = async (id: number): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}/tracked/${id}/untrack`, {
        method: 'POST'
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

export {
    getStocksByNameOrTicker,
    getTrackedStocks,
    setTrackedStock,
    setUntrackedStock
}