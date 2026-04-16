import {describe, it, expect, vi} from 'vitest';
import {deleteDiaryEntry, getDiaryEntries, postDiaryEntries, putDiaryEntry} from "#root/src/apis/DiaryEntryAPI.ts";
import {APIResponse, APIStatus} from "#root/src/types.ts";
import {DiaryEntry} from "#root/src/routes/portfolio-diary/types.ts";

describe.concurrent('Diary Entry API Tests', () => {

    describe('getDiaryEntries', async () => {

        it('should return a list of Diary Entries wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            stock_id: '101',
                            title: 'Test Diary Entry 1',
                            content: 'This is Test Diary Entry 1',
                            posted_date: new Date(2026, 0, 1),
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            stock_id: '101',
                            title: 'Test Diary Entry 2',
                            content: 'This is Test Diary Entry 2',
                            posted_date: new Date(2026, 1, 1),
                            created_datetime: new Date(2026, 1, 1),
                            last_modified_datetime: new Date(2026, 1, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<DiaryEntry[]> = await getDiaryEntries('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                stockId: '101',
                title: 'Test Diary Entry 1',
                content: 'This is Test Diary Entry 1',
                postedDate: new Date(2026, 0, 1),
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an empty list of Diary Entries for valid stock wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await getDiaryEntries('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return error wrapped in a API Response for missing param', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({
                    status: -100,
                    data: [
                        {
                            'index': 0,
                            'errorMessages': [
                                'Field \"stock_id\" is required'
                            ]
                        }
                    ]
                })
            });

            const response: APIResponse<DiaryEntry[]> = await getDiaryEntries('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('postDiaryEntries', () => {

        it('should return a list of success responses wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            "affectedRows": 1,
                            "insertId": "22",
                            "warningStatus": 0
                        }
                    ]
                })
            });

            const response: APIResponse<DiaryEntry[]> = await postDiaryEntries([
                {
                    stockId: "101",
                    title: "The Day My Butt Went Psycho 4",
                    content: "I kind of forgot about what the book was about4",
                    postedDate: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual(['22']);
        });

        it('should return an empty list wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await postDiaryEntries([
                {
                    stockId: "101",
                    title: "The Day My Butt Went Psycho 4",
                    content: "I kind of forgot about what the book was about4",
                    postedDate: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('putDiaryEntries', () => {

        it('should return a list of success responses wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            "affectedRows": 1,
                            "insertId": "22",
                            "warningStatus": 0
                        }
                    ]
                })
            });

            const response: APIResponse<DiaryEntry[]> = await putDiaryEntry([
                {
                    id: '1',
                    stockId: "101",
                    title: "The Day My Butt Went Psycho 4",
                    content: "I kind of forgot about what the book was about4",
                    postedDate: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await putDiaryEntry([
                {
                    id: '1',
                    stockId: "101",
                    title: "The Day My Butt Went Psycho 4",
                    content: "I kind of forgot about what the book was about4",
                    postedDate: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('deleteDiaryEntries', () => {

        it('should return success response wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: {
                        id: "22",
                        status: "success"
                    }
                })
            });

            const response: APIResponse<DiaryEntry[]> = await deleteDiaryEntry('22');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return an error wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await deleteDiaryEntry('22');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });
});