//Implements interface of ListItem from ListContainer
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";

import './TransactionComponent.css';

type TransactionComponentProps = {
    item: TransactionData
}

export type TransactionData = ListItem & {
    type: string;
    amountPerShare: number;
    quantity: number;
    fee: number;
    transactionDate: Date;
}

const TransactionComponent = (props: TransactionComponentProps) => {

    const {
        item
    } = props;

    let bgColour = 'black';
    let calculationString = '';
    let totalAmount = 0;

    switch (item.type) {
        case 'Buy':
            bgColour = '#77DD77';
            calculationString = `Buy ${item.quantity} @ $${item.amountPerShare} + $${item.fee}`;
            totalAmount = item.amountPerShare * item.quantity + item.fee;
            break;
        case 'Sell':
            bgColour = '#FF6961';
            calculationString = `Sell ${item.quantity} @ $${item.amountPerShare} - $${item.fee}`;
            totalAmount = item.amountPerShare * item.quantity - item.fee;
            break;
        case 'Dividend':
            bgColour = '#FDFD96';
            calculationString = `Dividend ${item.quantity} @ $${item.amountPerShare} - $${item.fee}`;
            totalAmount = item.amountPerShare * item.quantity - item.fee;
            break;
        default:
            calculationString = 'An error has occurred';
            break;
    }

    return (
        <div
            key={`${item.transactionDate.valueOf()}${item.type}${item.quantity}${item.amountPerShare}`}
            className='transaction-component'
        >
            <div
                className='transaction-component__classification-strip'
                style={{
                    backgroundColor: bgColour
                }}
            ></div>
            <div className='transaction-component__data-container'>
                <div>
                    <span className='transaction-component__date'>{dateToStringConverter(item.transactionDate)}</span>
                </div>
                <div>
                    <span className='transaction-component__calculation'>{calculationString}</span>
                    <br/>
                    <span className='transaction-component__amount'>${totalAmount}</span>
                </div>
            </div>
        </div>
    );
}

export default TransactionComponent;