import './NewTransactionComponent.css';
import {useState} from "react";

const NewTransactionComponent = () => {

    const [transactionType, setTransactionType] = useState<string>('Buy');
    const [amtWFee, setAmtWFee] = useState(0);
    const [amtWOFee, setAmtWOFee] = useState(0);
    const [quantity, setQuantity] = useState(0);

    let preview = '';

    switch (transactionType) {
        case 'Buy':
            preview = `${quantity ? quantity : 'QTY'} @ ${quantity && amtWOFee ? amtWOFee / quantity : 'PPS'} + ${amtWFee && amtWOFee ? amtWFee - amtWOFee : 'FEE'}`;
            break;
        case 'Sell':
            preview = `${quantity ? quantity : 'QTY'} @ ${quantity && amtWOFee ? amtWOFee / quantity : 'PPS'} - ${amtWFee && amtWOFee ? amtWFee - amtWOFee : 'FEE'}`;
            break;
        case 'Dividend':
            preview = `${quantity ? quantity : 'QTY'} @ ${quantity && amtWOFee ? amtWOFee / quantity : 'PPS'} + ${amtWFee && amtWOFee ? amtWFee - amtWOFee : 'FEE'}`;
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
                    <input
                        type='text'
                        name='totalAmountWFee'
                        value={amtWFee}
                        onChange={(e) => {
                        setAmtWFee(parseInt(e.target.value));
                    }} />
                </div>
                <div className='new-transaction-component__item-container'>
                    <label>Amt w/o Fee</label>
                    <input
                        type='text'
                        name='totalAmountWOFee'
                        value={amtWOFee}
                        onChange={(e) => {
                            setAmtWOFee(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className='new-transaction-component__item-container'>
                    <label>Quantity</label>
                    <input
                        type='text'
                        name='quantity'
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(parseInt(e.target.value));
                        }}
                    />
                </div>
            </div>
            <div className='new-transaction-component__preview'>
                {preview}
            </div>
        </div>
    );
}

export default NewTransactionComponent;