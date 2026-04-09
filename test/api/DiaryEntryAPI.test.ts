import {describe, it, expect, vi} from 'vitest';
import {getDiaryEntries} from "#root/src/apis/DiaryEntryAPI.ts";
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
    });

    describe('postDiaryEntries', () => {

    });

    describe('putDiaryEntries', () => {

    });

    describe('deleteDiaryEntries', () => {

    });
});