import {APIResponse, APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = 'http://localhost:3000/stock';

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
    getTrackedStocks,
    setTrackedStock,
    setUntrackedStock
}