import { Form } from 'react-bootstrap';
import './NumberInput.css';

type NumberInputProps = {
    id?: string,
    value: string | null,
    onChange: (value: string) => void,
    type: string
}

const NumberInput = (props:NumberInputProps) => {

    const {
        id,
        value,
        onChange,
        type
    } = props;

    const valueString = value ? value.toString() : '';

    let validationPattern: RegExp;
    switch (type) {
        case 'integer':
            validationPattern = /^[0-9]*$/;
            break;
        case 'currency':
            validationPattern = /^[0-9]*\.?[0-9]{0,2}$/;
            break;
        default:
            validationPattern = /^[0-9]*$/;
            break;
    }

    return (
        <Form.Control
            id={id}
            className='number-input'
            type='text'
            value={valueString}
            onChange={(e) => {

                const sanitizedValue = e.target.value.replace(/^[^0-9.]$/, '');

                if (!validationPattern.test(sanitizedValue)) return;

                onChange(sanitizedValue);
            }}
            onBlur={(e) => {

                //TODO: consider cleaning up

                if (type !== 'currency') return;

                if (e.target.value === '') return;

                if (/\.[0-9]{2}$/.test(e.target.value)) return;

                //actual handler
                if (e.target.value.indexOf('.') === -1) {

                    onChange(e.target.value + '.00');
                } else if (e.target.value.indexOf('.') === e.target.value.length - 1) {

                    onChange(e.target.value + '00');
                } else {

                    onChange(e.target.value + '0');
                }
            }}
        />
    );
}

export default NumberInput;