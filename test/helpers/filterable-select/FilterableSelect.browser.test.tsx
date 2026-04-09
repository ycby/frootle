import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import {render, waitFor, cleanup, screen} from "@testing-library/react";
import { ReactElement } from "react";
import {page, userEvent} from "vitest/browser";

const dataList: string[] = [
    'Label 1',
    'Label 2',
    'Label 3',
];

const mockFunction = async (arg: string): Promise<string[]> => {

    return dataList.filter((element: string): boolean => element.includes(arg));
}

describe('FilterableSelect', () => {

    beforeEach(cleanup);

    test('Checks if typing can filter results to single result', async () => {

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<>{value}</>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}abel 1');
        });

        expect(screen.queryByText('Label 1')).toBeInTheDocument();

        expect(screen.queryByText('Label 2')).not.toBeInTheDocument();
    });

    test('Checks if typing can filter results to no result', async () => {

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<>{value}</>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}abel z');
        });

        expect(screen.queryByText('No results found...')).toBeInTheDocument();

        expect(screen.queryByText('Label 1')).not.toBeInTheDocument();
    });

    test('Checks if returns the right value by clicks', async () => {

        let result: string | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => result = value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<>{value}</>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}ab');

            await userEvent.click(page.getByText('Label 1'));
        });

        expect(result !== null && result === 'Label 1');
        expect(filterableSelect).toHaveValue('Label 1');
    });

    test('Checks if returns the right value by arrow keys', async () => {

        let result: string | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => result = value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<>{value}</>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');

            await userEvent.keyboard('{ArrowDown>2/}{Enter}');
        })

        expect(result !== null && result === 'Label 2');
        expect(filterableSelect).toHaveValue('Label 2');
    });

    test('Checks if returns the right value by arrow keys after exceeding list length', async () => {

        let result: string | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => result = value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<>{value}</>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');

            await userEvent.keyboard('{ArrowDown>4/}{Enter}');
        })

        expect(result !== null && result === 'Label 3');
        expect(filterableSelect).toHaveValue('Label 3');
    });

    test('Checks if returns the right value by arrow keys after exceeding list start', async () => {

        let result: string | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: string): string => result = value}
                setInputValue={(value: string): string => value}
                renderItem={(value: string): ReactElement => (<div>{value}</div>)}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');
            await userEvent.keyboard('{ArrowDown>4/}');
            await userEvent.keyboard('{ArrowUp>3/}');
            await userEvent.keyboard('b');
        })

        expect(result === null);
        expect(filterableSelect).toHaveValue('Lab');
    });
});