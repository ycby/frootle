import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import {FilterableSelectData} from "#root/src/helpers/filterable-select/FilterableSelectItem.tsx";
import {render, waitFor, cleanup} from "@testing-library/react";
import {page, userEvent} from "vitest/browser";

const dataList: FilterableSelectData[] = [
    {
        label: 'Label 1',
        value: 'Value 1',
        subtext: 'Subtext 1',
    },
    {
        label: 'Label 2',
        value: 'Value 2',
        subtext: 'Subtext 2',
    },
    {
        label: 'Label 3',
        value: 'Value 3',
        subtext: 'Subtext 3',
    }
];

const mockFunction = async (arg: string): Promise<FilterableSelectData[]> => {

    return dataList.filter((element) => element.label?.includes(arg) || element.subtext?.includes(arg));
}

describe('FilterableSelect', () => {

    beforeEach(cleanup);

    test('Checks if typing can filter results to single result', async () => {

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): FilterableSelectData => {

                    return value;
                }}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}abel 1');
        });

        await expect.element(page.getByRole('listitem')
            .filter({
                hasText: 'Label 1'
            })
        ).toBeInTheDocument();

        await expect.element(page.getByRole('listitem')
            .filter({
                hasText: 'Label 2'
            })
        ).not.toBeInTheDocument();
    });

    test('Checks if typing can filter results to no result', async () => {

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): FilterableSelectData => {

                    return value;
                }}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}abel z');
        });

        await expect.element(page.getByRole('listitem')
            .filter({
                hasText: 'No results found'
            })
        ).toBeInTheDocument();

        await expect.element(page.getByRole('listitem')
            .filter({
                hasText: 'Label 1'
            })
        ).not.toBeInTheDocument();
    });

    test('Checks if returns the right value by clicks', async () => {

        let result: FilterableSelectData | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): void => {

                    result = value;
                }}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');

            const filterableItem1 = page.getByRole('listitem')
                .filter({
                    hasText: 'Label 1'
                });

            await userEvent.click(filterableItem1);
        });

        // @ts-ignore
        expect(result !== null && result.label === 'Label 1');
        await expect.element(filterableSelect).toHaveValue('Label 1');
    });

    test('Checks if returns the right value by arrow keys', async () => {

        let result: FilterableSelectData | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): void => {

                    result = value;
                }}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');

            await userEvent.keyboard('{ArrowDown>2/}{Enter}');
        })

        // @ts-ignore
        expect(result !== null && result.label === 'Label 2');
        await expect.element(filterableSelect).toHaveValue('Label 2');
    });

    test('Checks if returns the right value by arrow keys after exceeding list length', async () => {

        let result: FilterableSelectData | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): void => {

                    result = value;
                }}
            />
        );

        const filterableSelect = page.getByPlaceholder('Search...' );

        await waitFor(async () => {

            await userEvent.click(filterableSelect);

            await userEvent.keyboard('{Shift>}L{/Shift}a');

            await userEvent.keyboard('{ArrowDown>4/}{Enter}');
        })

        // @ts-ignore
        expect(result !== null && result.label === 'Label 3');
        await expect.element(filterableSelect).toHaveValue('Label 3');
    });

    test('Checks if returns the right value by arrow keys after exceeding list start', async () => {

        let result: FilterableSelectData | null = null;

        render(
            <FilterableSelect
                queryFn={mockFunction}
                onSelect={(value: FilterableSelectData): void => {

                    result = value;
                }}
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
        await expect.element(filterableSelect).toHaveValue('Lab');
    });
});