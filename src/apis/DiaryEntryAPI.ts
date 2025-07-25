import {DiaryEntryBE, DiaryEntryData} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse, APIStatus} from "#root/src/types.ts";

const baseUrl = 'http://localhost:3000/diary-entry';

const getDiaryEntries = async (stockId: number): Promise<APIResponse<DiaryEntryBE[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    //TODO: consider changing this, doesn't make sense to return empty array when there is an error
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
    };
}

const postDiaryEntries = async (data: DiaryEntryBE | DiaryEntryBE[]): Promise<APIResponse<any[]>> => {

    const processedData = data instanceof Array ? data : [data];

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok)  {

        console.error(response)
        console.error(await response.json());

        return {
            status: APIStatus.FAIL,
            data: []
        };
    }

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 1 ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

const putDiaryEntry = async (id: number, data: DiaryEntryData): Promise<APIResponse<any[]>> => {

    const processedData = {...data, id: id};

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 1 ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

const deleteDiaryEntry = async (id: number): Promise<APIResponse<any[]>> => {

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) return {
        status: APIStatus.FAIL,
        data: []
    };

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 'success' ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

export {
    getDiaryEntries,
    postDiaryEntries,
    putDiaryEntry,
    deleteDiaryEntry
}