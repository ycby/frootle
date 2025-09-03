import {APIResponse, APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = 'http://localhost:3000/short';

const getShortData = async (stockCode: string, startDate: string, endDate: string): Promise<APIResponse<StockData[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockCode}&start_date=${startDate}&end_date=${endDate}`, {
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

const postShortData = async (payload: any[]): Promise<APIResponse<any>> => {

    const response = await fetch('http://localhost:3000/short', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return {
        status: APIStatus.SUCCESS,
        data: []
    };

    return {
        status: APIStatus.SUCCESS,
        data: responseJSON.data
    }
}


export {
    getShortData,
    postShortData
}