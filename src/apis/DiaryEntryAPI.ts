import {
    DiaryEntryBE,
    DiaryEntry,
} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse, APIStatus} from "#root/src/types.ts";
import {dateToStringConverter, stringToDateConverter} from "#root/src/helpers/DateHelpers.ts";

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/diary-entry`;

const diaryEntryMapperBE = (sourceObj: Partial<DiaryEntry>): Partial<DiaryEntryBE> => {

    const result: Partial<DiaryEntryBE> = {};

    if (sourceObj?.id) result.id = sourceObj.id;
    if (sourceObj?.stockId) result.stock_id = sourceObj.stockId;
    if (sourceObj?.title) result.title = sourceObj.title;
    if (sourceObj?.content) result.content = sourceObj.content;
    if (sourceObj?.postedDate) result.posted_date = dateToStringConverter(sourceObj.postedDate);

    return result;
}

const diaryEntryMapperFE = (sourceObj: DiaryEntryBE): DiaryEntry => {

    return {
        id: sourceObj.id,
        stockId: sourceObj.stock_id,
        title: sourceObj.title,
        content: sourceObj.content,
        postedDate: stringToDateConverter(sourceObj.posted_date) ?? new Date(1970, 1, 1)
    };
}

const getDiaryEntries = async (stockId: string): Promise<APIResponse<DiaryEntry[]>> => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET',
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
        data: responseJSON.data.map((element: DiaryEntryBE) => diaryEntryMapperFE(element))
    };
}

const postDiaryEntries = async (data: Omit<DiaryEntry, 'id'> | Omit<DiaryEntry, 'id'>[]): Promise<APIResponse<any[]>> => {

    const processedData = data instanceof Array
        ? data.map(element => diaryEntryMapperBE(element))
        : [diaryEntryMapperBE(data)];

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok)  {

        console.error(response)

        return {
            status: APIStatus.FAIL,
            data: []
        };
    }

    const responseJSON = await response.json();

    return {
        status: responseJSON.status === 1 ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: responseJSON.data.map((d: any) => d.insertId)
    };
}

const putDiaryEntry = async (data: Pick<DiaryEntry, 'id'> | Pick<DiaryEntry, 'id'>[]): Promise<APIResponse<any[]>> => {

    const processedData = data instanceof Array
        ? data.map(element => diaryEntryMapperBE(element))
        : [diaryEntryMapperBE(data)];

    const response = await fetch(`${baseUrl}/`, {
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

const deleteDiaryEntry = async (id: string): Promise<APIResponse<any[]>> => {

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {

        return {
            status: APIStatus.FAIL,
            data: []
        };
    }

    const responseJSON = await response.json();

    return {
        status: responseJSON.data.status === 'success' ? APIStatus.SUCCESS : APIStatus.FAIL,
        data: []
    };
}

export {
    getDiaryEntries,
    postDiaryEntries,
    putDiaryEntry,
    deleteDiaryEntry
}