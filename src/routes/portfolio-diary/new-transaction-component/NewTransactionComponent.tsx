import './NewTransactionComponent.css';
import {useId} from "react";
import NumberInput from "#root/src/helpers/number-input/NumberInput.tsx";
import {
    Currency,
    CurrencyKeys,
    NewItemView,
    TransactionType,
    TransactionTypeKeys
} from "#root/src/types.ts";
import {capitaliseWord, replaceUnderscoreWithSpace} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {NewTransactionInputs} from "#root/src/routes/portfolio-diary/types.ts";
import {Col, Form, Row} from 'react-bootstrap';
import Container from "react-bootstrap/Container";

const NewTransactionComponent = (props: NewItemView<NewTransactionInputs>) => {

    const {
        sourceObject,
        updateSource
    } = props;

    const transactionDateId = useId();
    const transactionTypeId = useId();
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
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? (amtWOFeeNum / quantityNum).toFixed(2) : 'PPS'} - ${amtWFeeNum && amtWOFeeNum ? (amtWOFeeNum - amtWFeeNum).toFixed(2) : 'FEE'}`;
            break;
        case TransactionType.SCRIP_DIVIDEND:
            preview = `${quantityNum ? quantityNum : 'QTY'} @ ${quantityNum && amtWOFeeNum ? (amtWOFeeNum / quantityNum).toFixed(2) : 'PPS'} + ${amtWFeeNum && amtWOFeeNum ? (amtWFeeNum - amtWOFeeNum).toFixed(2) : 'FEE'}`;
            break;
        case TransactionType.CASH_DIVIDEND:
            preview = `${amtWFeeNum ? amtWFeeNum.toFixed(2) : 'AMT'} - ${amtWFeeNum && amtWOFeeNum ? (amtWOFeeNum - amtWFeeNum).toFixed(2) : 'FEE'}`;
            break;
        default:
            preview = `Select a transaction type`;
    }

    return(
        <>
            <Container fluid>
                <Row lg={2} sm={1} className='gy-3'>
                    <Col>
                        <Form.Group controlId={transactionTypeId}>
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={sourceObject.type}
                                onChange={(e) => {

                                    //initiate dividend value with cash first
                                    const selectedValue = e.target.value as TransactionTypeKeys;
                                    updateSource({
                                        ...sourceObject,
                                        type: selectedValue
                                    });
                                }}
                            >
                                {generateTypeOptions(transactionTypeId)}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={transactionDateId}>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type='date'
                                value={sourceObject.transactionDate}
                                onChange={(e) => {
                                    updateSource({...sourceObject, transactionDate: e.target.value});
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={amtWFeeId}>
                            <Form.Label>Amt w/ Fee</Form.Label>
                            <NumberInput
                                type='currency'
                                value={sourceObject.amtWFee}
                                onChange={(newValue) => {
                                    updateSource({...sourceObject, amtWFee: newValue});
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={amtWOFeeId}>
                            <Form.Label>Amt w/o Fee</Form.Label>
                            <NumberInput
                                type='currency'
                                value={sourceObject.amtWOFee}
                                onChange={(newValue) =>  {
                                    updateSource({...sourceObject, amtWOFee: newValue});
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group
                            controlId={quantityId}
                            style={sourceObject.type === 'cash_dividend' ? {display: 'none'} : {}}
                        >
                            <Form.Label>Quantity</Form.Label>
                            <NumberInput
                                value={sourceObject.quantity}
                                onChange={(newValue) => {
                                    updateSource({...sourceObject, quantity: newValue});
                                }}
                                type='integer'
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={currencyId}>
                            <Form.Label>Currency</Form.Label>
                            <Form.Select
                                value={sourceObject.currency}
                                onChange={(e) => {

                                    updateSource({...sourceObject, currency: e.target.value as CurrencyKeys});
                                }}>
                                {
                                    Object.values(Currency).map((currency: CurrencyKeys) => {
                                        return (<option key={`${currencyId}-${currency}`} value={currency}>{currency}</option>)
                                    })
                                }
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <div className='new-transaction-component__preview'>
                {preview}
            </div>
        </>
    );
}

const generateTypeOptions = (transactionTypeId: string) => {

    return Object.values(TransactionType).map((transactionType: TransactionTypeKeys) => {

        return(<option key={`${transactionTypeId}-${transactionType}`} value={transactionType}>{replaceUnderscoreWithSpace(capitaliseWord(transactionType))}</option>)
    })
}

export default NewTransactionComponent;