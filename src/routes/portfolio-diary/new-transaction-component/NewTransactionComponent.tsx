import './NewTransactionComponent.css';
import {useId} from "react";
import NumberInput from "#root/src/helpers/number-input/NumberInput.tsx";

export type NewTransactionInputs = {
    type: string;
    amtWFee: string;
    amtWOFee: string;
    quantity: string;
}
type NewTransactionComponentProps = {
    sourceObject: NewTransactionInputs;
    updateSource: (sourceObject: NewTransactionInputs) => void;
}

const NewTransactionComponent = (props: NewTransactionComponentProps) => {

    const {
        sourceObject,
        updateSource
    } = props;

    const transactionTypeId = useId();
    const amtWFeeId = useId();
    const amtWOFeeId = useId();
    const quantityId = useId();

    let preview: string;

    const amtWFeeNum = Number(sourceObject.amtWFee);
    const amtWOFeeNum = Number(sourceObject.amtWOFee);
    const quantityNum = Number(sourceObject.quantity);

    switch (sourceObject.type) {
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
            preview = `Select a transaction type`;
    }

    return(
        <div className='new-transaction-component'>
            <div className='new-transaction-component__items'>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={transactionTypeId}>Type</label>
                    <select
                        id={transactionTypeId}
                        name="type"
                        value={sourceObject.type}
                        onChange={(e) => {
                            updateSource({...sourceObject, type: e.target.value});
                        }}
                    >
                        <option value='Select Type'>Select Type</option>
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
                            value={sourceObject.amtWFee}
                            onChange={(newValue) => {
                                updateSource({...sourceObject, amtWFee: newValue});
                            }}
                        />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={amtWOFeeId}>Amt w/o Fee</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            id={amtWOFeeId}
                            type='currency'
                            name='totalAmountWOFee'
                            value={sourceObject.amtWOFee}
                            onChange={(newValue) =>  {
                                updateSource({...sourceObject, amtWOFee: newValue});
                            }}
                        />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={quantityId}>Quantity</label>
                    <div className='new-transaction-component__item-input'>
                        <NumberInput
                            id={quantityId}
                            name='quantity'
                            value={sourceObject.quantity}
                            onChange={(newValue) => {
                                updateSource({...sourceObject, quantity: newValue});
                            }}
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