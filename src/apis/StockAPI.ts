import {APIResponse, APIStatus, CurrencyKeys, PaginationResponse} from "#root/src/types.ts";
import {StockData, StockDataBE} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/stock`;

const stockMapperFE = (sourceObj: StockDataBE): StockData => {

    return {
        id: sourceObj.id.toString(),
        name: sourceObj.name,
        tickerNo: sourceObj.ticker_no,
        fullName: sourceObj.full_name,
        description: sourceObj.description,
        category: sourceObj.category,
        subcategory: sourceObj.subcategory,
        boardLot: sourceObj.board_lot,
        ISIN: sourceObj.ISIN,
        currency: sourceObj.currency as CurrencyKeys,
        isActive: sourceObj.is_active,
        createdDatetime: sourceObj.created_datetime,
        lastModifiedDatetime: sourceObj.last_modified_datetime,
    }
}

const stockMapperBE = (sourceObj: StockData): Partial<StockDataBE> => {

    const result: Partial<StockDataBE> = {};

    if (sourceObj.id !== undefined) result.id = sourceObj.id;
    if (sourceObj.name !== undefined) result.name = sourceObj.name;
    if (sourceObj.tickerNo !== undefined) result.ticker_no = sourceObj.tickerNo;
    if (sourceObj.fullName !== undefined) result.full_name = sourceObj.fullName;
    if (sourceObj.description !== undefined) result.description = sourceObj.description;
    if (sourceObj.category !== undefined) result.category = sourceObj.category;
    if (sourceObj.subcategory !== undefined) result.subcategory = sourceObj.subcategory;
    if (sourceObj.boardLot !== undefined) result.board_lot = sourceObj.boardLot;
    if (sourceObj.ISIN !== undefined) result.ISIN = sourceObj.ISIN;
    if (sourceObj.currency !== undefined) result.currency = sourceObj.currency;
    if (sourceObj.isActive !== undefined) result.is_active = sourceObj.isActive;

    return result;
}

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

const setTrackedStock = async (id: string): Promise<APIResponse<any[]>> => {

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

const getStockDuplicates = async (limit: number = 10, offset: number = 0): Promise<APIResponse<PaginationResponse<any>>> => {

    const response = await fetch(`${baseUrl}/duplicates?limit=${limit}&offset=${offset}`, {
        method: 'GET'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: {
            total_rows: '0',
            limit: limit,
            offset: offset,
            data: []
        }
    };

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: {
            total_rows: '0',
            limit: limit,
            offset: offset,
            data: []
        }
    };

    return {
        status: APIStatus.SUCCESS,
        data: {
            total_rows: responseJSON.data.total_rows,
            limit: limit,
            offset: offset,
            data: responseJSON.data.data.map(element => (
                {
                    ISIN: element.ISIN,
                    duplicates: element.duplicates.map(duplicate => stockMapperFE(duplicate))
                }
            ))
        }
    };
}

const mergeStockDuplicates = async (survivor: StockData, rejects: StockData[]): Promise<APIResponse<any>> => {

    const bodyPayload = {
        survivor: stockMapperBE(survivor),
        rejects: rejects.map(stockMapperBE)
    };

    const response = await fetch(`${baseUrl}/duplicates`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: {}
    };

    const responseJSON = await response.json();

    if (responseJSON.status === 'failed') return {
        status: APIStatus.FAIL,
        data: responseJSON.data
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
    setUntrackedStock,
    getStockDuplicates,
    mergeStockDuplicates
}