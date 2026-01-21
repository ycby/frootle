import {APIResponse, APIStatus} from "#root/src/types.ts";
import {ShortData, StockData} from "#root/src/routes/portfolio-diary/types.ts";
import {stringToDateConverter} from "#root/src/helpers/DateHelpers.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/short`;

const shortMapper: (extObj: any) => ShortData | null = (extObj: any): ShortData | null => {

    const parsedReportingDate: Date | null = stringToDateConverter(extObj.reporting_date);

    if (!parsedReportingDate) return null;

    return {
        id: extObj.id,
        stockId: extObj.stock_id,
        shortedShares: extObj.shorted_shares,
        shortedAmount: extObj.shorted_amount,
        reportingDate: parsedReportingDate,
        tickerNo: extObj.ticker_no
    };
}

const getShortData = async (stockId: string, startDate: string, endDate: string): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}&start_date=${startDate}&end_date=${endDate}`, {
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
        data: responseJSON.data
    }
}

const postShortData = async (payload: any[]): Promise<APIResponse<any>> => {

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    const responseJSON = await response.json();

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: responseJSON.data
    };

    if (responseJSON.status !== 1) return {
        status: APIStatus.SUCCESS,
        data: []
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    }
}

const getShortDataTickersWithNoStock = async (limit: number = 10, offset: number = 0): Promise<APIResponse<string[]>> => {

    const response = await fetch(`${baseUrl}/mismatch?limit=${limit}&offset=${offset}`, {
        method: 'GET',
    });

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: []
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    }
}

const getShortDataWithNoStock = async (tickerNo: string = ''): Promise<APIResponse<ShortData[]>> => {

    console.log(tickerNo);
    const response = await fetch(`${baseUrl}/mismatch/${tickerNo}`, {
        method: 'GET',
    });

    const responseJSON = await response.json();
    console.log(responseJSON.data);

    if (responseJSON.status !== 1) return {
        status: APIStatus.FAIL,
        data: []
    };

    const processedData: ShortData[] = [];
    responseJSON.data.forEach((element: any): void => {

        const shortData = shortMapper(element);

        if (shortData) processedData.push(shortData);
    });

    return {
        status: APIStatus.SUCCESS,
        data: processedData
    }
}


export {
    getShortData,
    postShortData,
    getShortDataTickersWithNoStock,
    getShortDataWithNoStock
}