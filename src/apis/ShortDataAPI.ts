import {APIResponse, APIStatus} from "#root/src/types.ts";
import {ShortData, ShortDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import {dateToStringConverter, stringToDateConverter} from "#root/src/helpers/DateHelpers.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/short`;

const shortMapperFE = (extObj: ShortDataBE): ShortData | null => {

    const parsedReportingDate: Date | null = stringToDateConverter(extObj.reporting_date);

    if (!parsedReportingDate) return null;

    return {
        id: extObj.id,
        stockId: extObj.stock_id,
        shortedShares: extObj.shorted_shares,
        shortedAmount: extObj.shorted_amount,
        reportingDate: parsedReportingDate,
        tickerNo: extObj.ticker_no,
        createdDatetime: new Date(extObj.created_datetime),
        lastModifiedDatetime: new Date(extObj.last_modified_datetime),
    };
}

const shortMapperBE = (extObj: ShortData): Partial<ShortDataBE> => {

    const result: any = {};

    if (extObj.id !== undefined) result.id = extObj.id;
    if (extObj.stockId !== undefined) result.stock_id = extObj.stockId;
    if (extObj.reportingDate !== undefined) result.reporting_date = dateToStringConverter(extObj.reportingDate);
    if (extObj.tickerNo !== undefined) result.ticker_no = extObj.tickerNo;
    if (extObj.shortedShares !== undefined) result.shorted_shares = extObj.shortedShares;
    if (extObj.shortedAmount !== undefined) result.shorted_amount = extObj.shortedAmount;
    if (extObj.name !== undefined) result.name = extObj.name;

    return result;
}

const getShortData = async (stockId: string, startDate: string, endDate: string): Promise<APIResponse<ShortData[]>> => {

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
        data: responseJSON.data.map((element: ShortDataBE) => shortMapperFE(element))
    }
}

const postShortData = async (payload: any[]): Promise<APIResponse<any>> => {

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.map(shortMapperBE)),
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

const putShortData = async (payload: any[]): Promise<APIResponse<any>> => {

    console.log(payload)
    const response = await fetch(`${baseUrl}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload.map(shortMapperBE))
    });

    const responseJSON = await response.json();

    console.log(responseJSON.data);
    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: responseJSON.data
    };

    if (responseJSON.status !== 1) return {
        status: APIStatus.SUCCESS,
        data: []
    }

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    }
}

const getShortDataTickersWithNoStock = async (limit: number = 10, offset: number = 0): Promise<APIResponse<any>> => {

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

        const shortData = shortMapperFE(element);

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
    putShortData,
    getShortDataTickersWithNoStock,
    getShortDataWithNoStock
}