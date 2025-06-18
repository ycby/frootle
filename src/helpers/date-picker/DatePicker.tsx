import { useId } from 'react';
import './DatePicker.css';

type DatePickerParams = {
    label: string | null,
    value: Date | null,
    onChange: (value: Date | null) => void
}

const DatePicker = (props:DatePickerParams) => {

    const {
        label,
        value,
        onChange
    } = props;

    const id = useId();

    return (
        <div className='date-picker'>
            <label htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type='date'
                value={dateToStringConverter(value)}
                onChange={(e) => {
                    onChange(stringToDateConverter(e.target.value));
                }}
            />
        </div>
    );
}

const dateToStringConverter = (value: Date | null) => {

    if (value === null) return '';

    return `${value.getFullYear()}-${(value.getMonth() + 1).toString().padStart(2, '0')}-${(value.getDate()).toString().padStart(2, '0')}`;
}

const stringToDateConverter = (value: String | null) => {

    if (value === null) return null;

    const dateArray = value.split('-');

    return new Date(parseInt(dateArray[0]), parseInt(dateArray[1]) - 1, parseInt(dateArray[2]));
}

export { DatePicker };