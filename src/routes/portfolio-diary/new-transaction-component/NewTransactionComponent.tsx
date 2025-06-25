import './NewTransactionComponent.css';
import {useId, useState} from "react";
import NumberInput from "#root/src/helpers/number-input/NumberInput.tsx";

const NewTransactionComponent = () => {

    const [transactionType, setTransactionType] = useState<string>('Buy');
    const [amtWFee, setAmtWFee] = useState('');
    const [amtWOFee, setAmtWOFee] = useState('');
    const [quantity, setQuantity] = useState('');

    const transactionTypeId = useId();
    const amtWFeeId = useId();
    const amtWOFeeId = useId();
    const quantityId = useId();

    let preview: string;

    const amtWFeeNum = Number(amtWFee);
    const amtWOFeeNum = Number(amtWOFee);
    const quantityNum = Number(quantity);

    switch (transactionType) {
        case 'Buy':
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? amtWOFeeNum / quantityNum : 'PPS'} + ${amtWFeeNum && amtWOFeeNum ? amtWFeeNum - amtWOFeeNum : 'FEE'}`;
            break;
        case 'Sell':
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? amtWOFeeNum / quantityNum : 'PPS'} - ${amtWFeeNum && amtWOFeeNum ? amtWFeeNum - amtWOFeeNum : 'FEE'}`;
            break;
        case 'Dividend':
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? amtWOFeeNum / quantityNum : 'PPS'} + ${amtWFeeNum && amtWOFeeNum ? amtWFeeNum - amtWOFeeNum : 'FEE'}`;
            break;
        default:
            preview = `An error occurred...`;
    }

    return(
        <div className='new-transaction-component'>
            <div className='new-transaction-component__items'>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={transactionTypeId}>Type</label>
                    <select
                        id={transactionTypeId}
                        name="type"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                    >
                        <option value='Buy'>Buy</option>
                        <option value='Sell'>Sell</option>
                        <option value='Dividend'>Dividend</option>
                    </select>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={amtWFeeId}>Amt w/ Fee</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            id={amtWFeeId}
                            type='currency'
                            name='totalAmountWFee'
                            value={amtWFee}
                            onChange={setAmtWFee} />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={amtWOFeeId}>Amt w/o Fee</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            id={amtWOFeeId}
                            type='currency'
                            name='totalAmountWOFee'
                            value={amtWOFee}
                            onChange={setAmtWOFee}
                        />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={quantityId}>Quantity</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            id={quantityId}
                            name='quantity'
                            value={quantity}
                            onChange={setQuantity}
                            type='integer'
                        />
                    </div>
                </div>
            </div>
            <div className='new-transaction-component__preview'>
                {preview}
            </div>
        </div>
    );
}

export default NewTransactionComponent;