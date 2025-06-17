import {render, screen, cleanup } from '@testing-library/react';
import '@vitest/browser/context';
import {DatePicker} from "#root/src/helpers/date-picker/DatePicker.tsx";
import "@vitest/browser/context";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";

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
})