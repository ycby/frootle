import {describe, it, expect, vi} from 'vitest';
import {APIResponse, APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";
import {
    getStocksByNameOrTicker,
    getTrackedStocks,
    setTrackedStock,
    setUntrackedStock
} from "#root/src/apis/StockAPI.ts";

describe.concurrent('Stock API Tests', () => {

    describe('getStocksByNameOrTicker', async () => {

        it('should return a list of Stocks wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            name: 'Test Stock 1',
                            ticker_no: '342',
                            full_name: 'Test Stock 1 Ltd.',
                            is_active: true,
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            name: 'Test Stock 2',
                            ticker_no: '343',
                            full_name: 'Test Stock 2 Ltd.',
                            is_active: true,
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<StockData[]> = await getStocksByNameOrTicker('Test');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                name: 'Test Stock 1',
                tickerNo: '342',
                fullName: 'Test Stock 1 Ltd.',
                isActive: true,
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an empty list of Stocks for non-existant stock wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: []
                })
            });

            const response: APIResponse<StockData[]> = await getStocksByNameOrTicker('yoyoyowtf');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return error wrapped in a API Response for backend error', async () => {

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

            const response: APIResponse<StockData[]> = await getStocksByNameOrTicker('failingparam');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('getTrackedStocks', () => {

        it('should return a list of success responses wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            name: 'Test Stock 1',
                            ticker_no: '342',
                            full_name: 'Test Stock 1 Ltd.',
                            is_active: true,
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            name: 'Test Stock 2',
                            ticker_no: '343',
                            full_name: 'Test Stock 2 Ltd.',
                            is_active: true,
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<StockData[]> = await getTrackedStocks();

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                name: 'Test Stock 1',
                tickerNo: '342',
                fullName: 'Test Stock 1 Ltd.',
                isActive: true,
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an empty list wrapped in a API Response on error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<StockData[]> = await getTrackedStocks();

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response on backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<StockData[]> = await getTrackedStocks();

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('setTrackedStock', () => {

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

            const response: APIResponse<any[]> = await setTrackedStock('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
        });

        it('should return an empty list wrapped in a API Response on error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: [
                        {
                            "affectedRows": 1,
                            "insertId": "22",
                            "warningStatus": 0
                        }
                    ]
                })
            });

            const response: APIResponse<StockData[]> = await setTrackedStock('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response on backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<StockData[]> = await setTrackedStock('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('setUntrackStock', () => {

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

            const response: APIResponse<any[]> = await setUntrackedStock('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
        });

        it('should return an empty list wrapped in a API Response on error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: [
                        {
                            "affectedRows": 1,
                            "insertId": "22",
                            "warningStatus": 0
                        }
                    ]
                })
            });

            const response: APIResponse<StockData[]> = await setUntrackedStock('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response on backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<StockData[]> = await setUntrackedStock('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });
});