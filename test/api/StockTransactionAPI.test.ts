import {describe, it, expect, vi} from 'vitest';
import {APIResponse, APIStatus, Currency, TransactionType} from "#root/src/types.ts";
import {DiaryEntry, TransactionData} from "#root/src/routes/portfolio-diary/types.ts";
import {
    deleteStockTransaction,
    getStockTransactions,
    postStockTransactions,
    putStockTransaction
} from "#root/src/apis/StockTransactionAPI.ts";
import Money from "money-type";

describe.concurrent('Stock Transaction API Tests', () => {

    describe('getStockTransactions', async () => {

        it('should return a list of Stock Transaction wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: [
                        {
                            id: '1',
                            stock_id: '101',
                            type: TransactionType.BUY,
                            amount: Money.fromNominalValue(10.01, 2, 'HKD').toJSON(),
                            quantity: 5,
                            amount_per_share: 2,
                            fee: Money.fromNominalValue(1.23, 2, 'HKD').toJSON(),
                            transaction_date: new Date(2026, 0, 1),
                            currency: 'HKD',
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        },
                        {
                            id: '2',
                            stock_id: '101',
                            type: TransactionType.SELL,
                            amount: Money.fromNominalValue(10.01, 2, 'HKD').toJSON(),
                            quantity: 5,
                            amount_per_share: 2,
                            fee: Money.fromNominalValue(1.23, 2, 'HKD').toJSON(),
                            transaction_date: new Date(2026, 0, 2),
                            currency: 'HKD',
                            created_datetime: new Date(2026, 0, 1),
                            last_modified_datetime: new Date(2026, 0, 1),
                        }
                    ]
                })
            });

            const response: APIResponse<TransactionData[]> = await getStockTransactions('101');

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toContainEqual({
                id: '1',
                stockId: '101',
                type: TransactionType.BUY,
                amount: Money.fromNominalValue(10.01, 2, 'HKD'),
                quantity: 5,
                amountPerShare: '2.00',
                fee: Money.fromNominalValue(1.23, 2, 'HKD'),
                transactionDate: new Date(2026, 0, 1),
                currency: 'HKD',
                createdDatetime: new Date(2026, 0, 1),
                lastModifiedDatetime: new Date(2026, 0, 1),
            });
        });

        it('should return an empty list of Stock Transactions for valid stock wrapped in a API Response for error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: 1,
                    data: []
                })
            });

            const response: APIResponse<TransactionData[]> = await getStockTransactions('101');

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

            const response: APIResponse<TransactionData[]> = await getStockTransactions('101');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('postStockTransactions', () => {

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

            const response: APIResponse<TransactionData[]> = await postStockTransactions([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual(['22']);
        });

        it('should return an empty list wrapped in a API Response for error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<TransactionData[]> = await postStockTransactions([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response for backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<TransactionData[]> = await postStockTransactions([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('putStockTransaction', () => {

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

            const response: APIResponse<TransactionData[]> = await putStockTransaction([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.SUCCESS);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response for error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<TransactionData[]> = await putStockTransaction([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an empty list wrapped in a API Response for backend error', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
            });

            const response: APIResponse<TransactionData[]> = await putStockTransaction([
                {
                    id: null,
                    stockId: '101',
                    type: TransactionType.BUY,
                    amtWFee: '103.00',
                    amtWOFee: '100.00',
                    quantity: '5',
                    transactionDate: '2026-01-01',
                    currency: Currency.HKD
                }
            ]);

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });

    describe('deleteStockTransaction', () => {

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

            const response: APIResponse<DiaryEntry[]> = await deleteStockTransaction('22');

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

            const response: APIResponse<DiaryEntry[]> = await deleteStockTransaction('22');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });

        it('should return an error wrapped in a API Response', async () => {

            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                json: () => Promise.resolve({
                    status: -100,
                    data: []
                })
            });

            const response: APIResponse<DiaryEntry[]> = await deleteStockTransaction('22');

            expect(response.status).toBe(APIStatus.FAIL);
            expect(response.data).toEqual([]);
        });
    });
});