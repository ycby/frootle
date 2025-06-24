import './NewTransactionComponent.css';
import {useState} from "react";
import NumberInput from "#root/src/helpers/number-input/NumberInput.tsx";

const NewTransactionComponent = () => {

    const [transactionType, setTransactionType] = useState<string>('Buy');
    const [amtWFee, setAmtWFee] = useState('');
    const [amtWOFee, setAmtWOFee] = useState('');
    const [quantity, setQuantity] = useState('');

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
                    <label>Type</label>
                    <select name="type">
                        <option value='Buy'>Buy</option>
                        <option value='Sell'>Sell</option>
                        <option value='Dividend'>Dividend</option>
                    </select>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label>Amt w/ Fee</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            type='currency'
                            name='totalAmountWFee'
                            value={amtWFee}
                            onChange={setAmtWFee} />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label>Amt w/o Fee</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            type='currency'
                            name='totalAmountWOFee'
                            value={amtWOFee}
                            onChange={setAmtWOFee}
                        />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label>Quantity</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
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