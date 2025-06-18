import {render, screen, cleanup, waitFor} from '@testing-library/react';
import '@vitest/browser/context';
import {DatePicker} from "#root/src/helpers/date-picker/DatePicker.tsx";
import "@vitest/browser/context";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {page, userEvent} from "@vitest/browser/context";

describe('DatePicker', () => {

    const testLabel = 'Test';

    afterEach(cleanup);

    test('Render the Date Picker with the right Label', async () => {

        render(<DatePicker label={testLabel} value={new Date()} onChange={(date) => date } />);
        expect(screen.getByText(testLabel)).toBeInTheDocument();
    });

    test('Check the Date matches the input Value', async () => {

        render(<DatePicker label={testLabel} value={new Date()} onChange={(date) => date } />);
        const todayAsString = dateToStringConverter(new Date());
        await expect.element(screen.getByLabelText(testLabel)).toHaveValue(todayAsString);
    });

    test('Check the Date changed input Value', async () => {

        const currentDate = new Date();
        let result: Date | null = currentDate;

        render(<DatePicker
            label={testLabel}
            value={currentDate}
            onChange={(date) => {

                result = date;
            }}
        />);

        const dateInputElement = page.getByLabelText(testLabel);

        await waitFor(async() => {

            await userEvent.click(dateInputElement);
            await userEvent.keyboard('{Space}{ArrowRight}{Enter}');
        });

        const adjustedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        expect(result === adjustedDate);
    });

    test('Check the Date changed type input Value', async () => {

        const currentDate = new Date();
        let result: Date | null = currentDate;

        render(<DatePicker
            label={testLabel}
            value={currentDate}
            onChange={(date) => {

                result = date;
            }}
        />);

        const dateInputElement = page.getByLabelText(testLabel);

        await waitFor(async() => {

            await userEvent.type(dateInputElement, '2025-01-01');
        });

        const adjustedDate = new Date(2025, 0, 1);
        expect(result === adjustedDate);
    });
})