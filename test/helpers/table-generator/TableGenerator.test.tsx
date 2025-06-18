import {afterEach} from "vitest";
import {cleanup, render} from "@testing-library/react";
import { TableGenerator, Header, TableData } from "#root/src/helpers/table-generator/TableGenerator.tsx";
import {page} from "@vitest/browser/context";

const headerData: Header[] = [
    {
        label: 'Header 1',
        value: 'header1'
    },
    {
        label: 'Header 2',
        value: 'header2'
    },
    {
        label: 'Header 3',
        value: 'header3'
    }
];

const bodyData: TableData[] = [
    {
        id: '1',
        header1: 'Test1',
        header2: 3,
        header3: '2025-01-01'
    },
    {
        id: '2',
        header1: 'Test2',
        header2: 5,
        header3: '2024-01-01'
    },
    {
        id: '3',
        header1: 'Test3',
        header2: 7,
        header3: '2023-01-01'
    },
]

describe('TableGenerator', () => {

    afterEach(cleanup);

    test('Render simple table', async () => {

        render(
            <TableGenerator headers={headerData} data={bodyData} />
        );

        await expect.element(page.getByText('Test1')).toBeInTheDocument();
        await expect.element(page.getByText('Test2')).toBeInTheDocument();
        await expect.element(page.getByText('Test3')).toBeInTheDocument();
        await expect.element(page.getByText('2023-01-01')).toBeInTheDocument();
        await expect.element(page.getByText('2024-01-01')).toBeInTheDocument();
        await expect.element(page.getByText('2025-01-01')).toBeInTheDocument();
    });

    test('Render simple table with hidden columns', async () => {

        render(
            <TableGenerator headers={headerData} data={bodyData} options={{hiddenColumns: ['header1']}} />
        );

        await expect.element(page.getByText('Header 1')).not.toBeInTheDocument();
        await expect.element(page.getByText('2023-01-01')).toBeInTheDocument();
        await expect.element(page.getByText('2024-01-01')).toBeInTheDocument();
        await expect.element(page.getByText('2025-01-01')).toBeInTheDocument();
    });
})