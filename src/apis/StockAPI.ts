import {APIResponse, APIStatus} from "#root/src/types.ts";
import {StockData, StockDataBE} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/stock`;

const stockMapperFE = (sourceObj: StockDataBE): StockData => {

    return {
        id: sourceObj.id.toString(),
        name: sourceObj.name,
        tickerNo: sourceObj.ticker_no,
        full_name: sourceObj.full_name,
        isActive: sourceObj.is_active
    }
}

// const stockMapperBE = (sourceObj: StockData): Partial<StockDataBE> => {
//
//     const result: Partial<StockDataBE> = {};
//
//     if (sourceObj.id !== undefined) result.id = sourceObj.id;
//     if (sourceObj.name !== undefined) result.name = sourceObj.name;
//     if (sourceObj.tickerNo !== undefined) result.ticker_no = sourceObj.tickerNo;
//     if (sourceObj.full_name !== undefined) result.full_name = sourceObj.full_name;
//     if (sourceObj.isActive !== undefined) result.is_active = sourceObj.isActive;
//
//     return result;
// }

const getStocksByNameOrTicker = async (queryTerm: string): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}?query_type=OR&name=${queryTerm}&ticker_no=${queryTerm}`, {
        method: 'GET',
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: []
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data.map((element: StockDataBE) => stockMapperFE(element))
    }
}

const getTrackedStocks = async (): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}/tracked`, {
        method: 'GET',
    });
    console.log(response.url);

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
        data: responseJSON.data.map((element: StockDataBE) => stockMapperFE(element))
    };
}

const setTrackedStock = async (id: number): Promise<APIResponse<any[]>> => {

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

const setUntrackedStock = async (id: string): Promise<APIResponse<any[]>> => {

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