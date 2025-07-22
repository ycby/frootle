import {DiaryEntryData} from "#root/src/routes/portfolio-diary/types.ts";

const baseUrl = 'http://localhost:3000/diary-entry';

const getDiaryEntries = async (stockId: number) => {

    const response = await fetch(`${baseUrl}?stock_id=${stockId}`, {
        method: 'GET'
    });

    //TODO: consider changing this, doesn't make sense to return empty array when there is an error
    if (!response.ok) return [];

    const responseJSON = await response.json();

    if (responseJSON.status !== 1) return [];

    return responseJSON.data;
}

const postDiaryEntries = async (data: DiaryEntryData | DiaryEntryData[]) => {

    const processedData = data instanceof Array ? data : [data];

    const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.status === 1;
}

const putDiaryEntry = async (id: number, data: DiaryEntryData) => {

    const processedData = {...data, id: id};

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(processedData),
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.status === 1;
}

const deleteDiaryEntry = async (id: number) => {

    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) return false;

    const responseJSON = await response.json();

    return responseJSON.status === 'success';
}

export {
    getDiaryEntries,
    postDiaryEntries,
    putDiaryEntry,
    deleteDiaryEntry
}