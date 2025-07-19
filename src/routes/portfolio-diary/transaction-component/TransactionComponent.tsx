//Implements interface of ListItem from ListContainer
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {ComponentStatus, TransactionType} from "#root/src/types.ts";
import './TransactionComponent.css';
import {NewTransactionInputs, TransactionData} from "#root/src/routes/portfolio-diary/types.ts";
import Button from "#root/src/helpers/button/Button.tsx";
import {TransactionDataListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";

type TransactionComponentProps = {
    item: TransactionDataListItem,
    editView: any,
    onEdit: (index: number) => void,
    onDelete: (index: number) => void,
    onBack: (index: number) => void,
}

type TransactionCalculatedDetails = {
    bgColor: string;
    calculationString: string;
    totalAmount: number;
}

const TransactionComponent = (props: TransactionComponentProps) => {

    const {
        item,
        editView,
        onEdit,
        onDelete,
        onBack,
    } = props;

    const componentDetails: TransactionCalculatedDetails = getTransactionDetails(item);

    return (
        <div
            key={`${item.transactionDate.valueOf()}${item.type}${item.quantity}${item.amountPerShare}`}
            className='transaction-component'
        >
            <div
                className='transaction-component__classification-strip'
                style={{
                    backgroundColor: componentDetails.bgColor
                }}
            ></div>
            {transactionComponentView(item, componentDetails, editView, onEdit, onDelete, onBack)}
        </div>
    );
}

const transactionComponentView = (item: TransactionDataListItem, calculatedDetails: TransactionCalculatedDetails, editView, onEdit: (index: number, newData: NewTransactionInputs) => void, onDelete: (index: number) => void, onBack: (index: number) => void) => {

    switch (item.status) {
        case ComponentStatus.VIEW:
            return (
                <div className='transaction-component__data-container'>
                    <div>
                        <span className='transaction-component__date'>{dateToStringConverter(item.transactionDate)}</span>
                    </div>
                    <div>
                        <span className='transaction-component__calculation'>{calculatedDetails.calculationString}</span>
                        <br/>
                        <span className='transaction-component__amount'>${calculatedDetails.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            );
        case ComponentStatus.EDIT:
            return (
                <div className='transaction-component__data-container'>
                    {editView}
                    <div className='transaction-component__button-container'>
                        <Button
                            onClick={() => onBack(item.index)}
                        >Back</Button>
                        <Button
                            onClick={() => onEdit(item.index)}
                        >Save</Button>
                    </div>
                </div>
            );
        case ComponentStatus.DELETE:
            return (
                <div className='transaction-component__data-container'>
                    <div>
                        Are you sure?
                    </div>
                    <div className='transaction-component__button-container'>
                        <Button
                            onClick={() => onBack(item.index)}
                        >Back</Button>
                        <Button
                            onClick={() => onDelete(item.index)}
                        >Delete</Button>
                    </div>
                </div>
            );
        default:
            return (
                <div>
                    Unknown Status... An error occurred in the component
                </div>
            );
    }
}

const getTransactionDetails = (transaction: TransactionData): TransactionCalculatedDetails => {

    let bgColour = 'black';
    let calculationString = '';
    let totalAmount = 0;

    switch (transaction.type) {
        case TransactionType.BUY:
            bgColour = '#77DD77';
            calculationString = `Buy ${transaction.quantity} @ $${transaction.amountPerShare.toFixed(2)} + $${transaction.fee.toFixed(2)}`;
            totalAmount = Number(transaction.amount) + Number(transaction.fee);
            break;
        case TransactionType.SELL:
            bgColour = '#FF6961';
            calculationString = `Sell ${transaction.quantity} @ $${transaction.amountPerShare.toFixed(2)} - $${transaction.fee.toFixed(2)}`;
            totalAmount = Number(transaction.amount) - Number(transaction.fee);
            break;
        case TransactionType.DIVIDEND:
            bgColour = '#FDFD96';
            calculationString = `Dividend ${transaction.quantity} @ $${transaction.amountPerShare.toFixed(2)} - $${transaction.fee.toFixed(2)}`;
            totalAmount = Number(transaction.amount) - Number(transaction.fee);
            break;
        default:
            calculationString = 'An error has occurred';
            break;
    }

    return {
        bgColor: bgColour,
        calculationString: calculationString,
        totalAmount: totalAmount
    };
}

export default TransactionComponent;