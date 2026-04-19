import {describe, it, expect, vi} from 'vitest';
import {APIResponse, APIStatus} from "#root/src/types.ts";
import {DiaryEntry, ShortData} from "#root/src/routes/portfolio-diary/types.ts";
import Money from "money-type";
import {
    getShortData,
    getShortDataTickersWithNoStock,
    getShortDataWithNoStock,
    putShortData
} from "#root/src/apis/ShortDataAPI.ts";

describe.concurrent('Short Data API Tests', () => {

    describe('getShortData', async () => {

        it('should return a list of Short Data wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            stock_id: '101',
                            ticker_no: '00020',
                            name: 'Test Stock 1',
                            shorted_shares: 1020300,
                            shorted_amount: new Money(100000001n, 2, 'HKD'),
                            reporting_date: new Date(2026, 0, 1),
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            stock_id: '101',
                            ticker_no: '00020',
                            name: 'Test Stock 1',
                            shorted_shares: 2020300,
                            shorted_amount: new Money(106000001n, 2, 'HKD').toJSON(),
                            reporting_date: new Date(2026, 0, 1),
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<ShortData[]> = await getShortData('101', '2025-12-01', '2026-12-31');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                stockId: '101',
                tickerNo: '00020',
                shortedShares: 1020300,
                shortedAmount: new Money(100000001n, 2, 'HKD'),
                reportingDate: new Date(2026, 0, 1),
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an empty list of Short Data for valid stock wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: []
                })
            });

            const response: APIResponse<ShortData[]> = await getShortData('101', '2025-12-01', '2026-12-31');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return error wrapped in a API Response if error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
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

            const response: APIResponse<ShortData[]> = await getShortData('101', '2025-01-01', '2026-12-31');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return error wrapped in a API Response if backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false
            });

            const response: APIResponse<ShortData[]> = await getShortData('101', '2025-01-01', '2026-12-31');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('putShortData', () => {

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

            const response: APIResponse<DiaryEntry[]> = await putShortData([
                {
                    id: '1',
                    stockId: '101',
                    tickerNo: '00020',
                    name: 'Test Stock 1',
                    shortedShares: 1020300,
                    shortedAmount: new Money(100000001n, 2, 'HKD'),
                    reportingDate: new Date(2026, 0, 1),
                    createdDatetime: new Date(2026, 0, 1),
                    lastModifiedDatetime: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                "affectedRows": 1,
                "insertId": "22",
                "warningStatus": 0
            });
        });

        it('should return an empty list wrapped in a API Response for error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await putShortData([
                {
                    id: '1',
                    stockId: '101',
                    tickerNo: '00020',
                    name: 'Test Stock 1',
                    shortedShares: 1020300,
                    shortedAmount: new Money(100000001n, 2, 'HKD'),
                    reportingDate: new Date(2026, 0, 1),
                    createdDatetime: new Date(2026, 0, 1),
                    lastModifiedDatetime: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response for backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<DiaryEntry[]> = await putShortData([
                {
                    id: '1',
                    stockId: '101',
                    tickerNo: '00020',
                    name: 'Test Stock 1',
                    shortedShares: 1020300,
                    shortedAmount: new Money(100000001n, 2, 'HKD'),
                    reportingDate: new Date(2026, 0, 1),
                    createdDatetime: new Date(2026, 0, 1),
                    lastModifiedDatetime: new Date(2026, 0, 1),
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('getShortDataTickersWithNoStock', () => {

        it('should return a list of success responses wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: {
                        total_rows: '2',
                        tickers: ['1', '2'],
                        offset: 0,
                        limit: 10,
                    }
                })
            });

            const response: APIResponse<any> = await getShortDataTickersWithNoStock(10, 0);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data.tickers).toEqual(['1', '2']);
        });

        it('should return an empty list wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<any> = await getShortDataTickersWithNoStock(10, 0);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('getShortDataWithNoStock', () => {

        it('should return success response wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            stock_id: '101',
                            ticker_no: '00020',
                            name: 'Test Stock 1',
                            shorted_shares: 1020300,
                            shorted_amount: new Money(100000001n, 2, 'HKD'),
                            reporting_date: new Date(2026, 0, 1),
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            stock_id: '101',
                            ticker_no: '00020',
                            name: 'Test Stock 1',
                            shorted_shares: 2020300,
                            shorted_amount: new Money(106000001n, 2, 'HKD').toJSON(),
                            reporting_date: new Date(2026, 0, 1),
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<ShortData[]> = await getShortDataWithNoStock('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                stockId: '101',
                tickerNo: '00020',
                shortedShares: 1020300,
                shortedAmount: new Money(100000001n, 2, 'HKD'),
                reportingDate: new Date(2026, 0, 1),
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an error wrapped in a API Response for error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<ShortData[]> = await getShortDataWithNoStock('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });
});