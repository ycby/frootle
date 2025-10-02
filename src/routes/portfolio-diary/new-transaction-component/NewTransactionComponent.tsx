import './NewTransactionComponent.css';
import {useId} from "react";
import NumberInput from "#root/src/helpers/number-input/NumberInput.tsx";
import {
    Currency,
    CurrencyKeys,
    DividendType,
    DividendTypeKeys,
    NewItemView,
    TransactionType,
    TransactionTypeKeys
} from "#root/src/types.ts";
import {capitaliseWord} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {NewTransactionInputs} from "#root/src/routes/portfolio-diary/types.ts";

const NewTransactionComponent = (props: NewItemView<NewTransactionInputs>) => {

    const {
        sourceObject,
        updateSource
    } = props;

    const transactionDateId = useId();
    const transactionTypeId = useId();
    const dividendTypeId = useId();
    const amtWFeeId = useId();
    const amtWOFeeId = useId();
    const quantityId = useId();
    const currencyId = useId();

    let preview: string;

    const amtWFeeNum = Number(sourceObject.amtWFee);
    const amtWOFeeNum = Number(sourceObject.amtWOFee);
    const quantityNum = Number(sourceObject.quantity);

    switch (sourceObject.type) {
        case TransactionType.BUY:
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? (amtWOFeeNum / quantityNum).toFixed(2) : 'PPS'} + ${amtWFeeNum && amtWOFeeNum ? (amtWFeeNum - amtWOFeeNum).toFixed(2) : 'FEE'}`;
            break;
        case TransactionType.SELL:
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? (amtWOFeeNum / quantityNum).toFixed(2) : 'PPS'} - ${amtWFeeNum && amtWOFeeNum ? (amtWFeeNum - amtWOFeeNum).toFixed(2) : 'FEE'}`;
            break;
        case TransactionType.DIVIDEND:
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? (amtWOFeeNum / quantityNum).toFixed(2) : 'PPS'} + ${amtWFeeNum && amtWOFeeNum ? (amtWFeeNum - amtWOFeeNum).toFixed(2) : 'FEE'}`;
            break;
        default:
            preview = `Select a transaction type`;
    }

    return(
        <div className='new-transaction-component'>
            <div className='new-transaction-component__items'>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={transactionDateId}>Date</label>
                    <div className='new-transaction-component__item-input'>
                        <input
                            type='date'
                            id={transactionDateId}
                            name='transactionDate'
                            value={sourceObject.transactionDate}
                            onChange={(e) => {
                                updateSource({...sourceObject, transactionDate: e.target.value});
                            }}
                        />
                    </div>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={transactionTypeId}>Type</label>
                    <select
                        id={transactionTypeId}
                        name="type"
                        value={sourceObject.type}
                        onChange={(e) => {

                            //initiate dividend value with cash first
                            const selectedValue = e.target.value as TransactionTypeKeys;
                            updateSource({
                                ...sourceObject,
                                type: selectedValue,
                                dividendType: selectedValue === TransactionType.DIVIDEND ? DividendType.CASH : null
                            });
                        }}
                    >
                        {generateTypeOptions(transactionTypeId)}
                    </select>
                </div>
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={dividendTypeId}>Dividend Type</label>
                    <div className='new-transaction-component__item-input'>
                    {
                        Object.values(DividendType).map((dividendType: DividendTypeKeys, index: number) => {

                            return (
                                <div className={`radio-button-group ${sourceObject.dividendType === dividendType ? 'selected' : ''}`}>
                                    <label>{capitaliseWord(dividendType)}</label>
                                    <input
                                        type='radio'
                                        id={`${dividendTypeId}_${index}`}
                                        key={dividendType}
                                        name='dividendType'
                                        value={dividendType}
                                        onChange={(e) => {
                                            updateSource({...sourceObject, dividendType: e.target.value as DividendTypeKeys});
                                        }}
                                    />
                                </div>
                            )
                        })
                    }
                    </div>
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
                <div className='new-transaction-component__item-container'>
                    <label htmlFor={currencyId}>Currency</label>
                    <div className='new-transaction-component__item-input'>
                        <select
                            id={currencyId}
                            name="currency"
                            value={sourceObject.currency}
                            onChange={(e) => {

                                updateSource({...sourceObject, currency: e.target.value as CurrencyKeys});
                            }}>
                            {
                                Object.values(Currency).map((currency: CurrencyKeys) => {
                                    return (<option key={`${currencyId}-${currency}`} value={currency}>{capitaliseWord(currency)}</option>)
                                })
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className='new-transaction-component__preview'>
                {preview}
            </div>
        </div>
    );
}

const generateTypeOptions = (transactionTypeId: string) => {

    return Object.values(TransactionType).map((transactionType: TransactionTypeKeys) => {

        return(<option key={`${transactionTypeId}-${transactionType}`} value={transactionType}>{capitaliseWord(transactionType)}</option>)
    })
}

export default NewTransactionComponent;