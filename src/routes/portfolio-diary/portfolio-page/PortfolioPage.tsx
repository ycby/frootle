import Container from 'react-bootstrap/Container';
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIResponse, APIStatus, ComponentStatus, ComponentStatusKeys} from "#root/src/types.ts";
import {
    NewTransactionInputs,
    StockData,
    TransactionData,
    TransactionDataBE
} from "#root/src/routes/portfolio-diary/types.ts";
import * as StockTransactionAPI from "#root/src/apis/StockTransactionAPI.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import {
    convertBEtoFETransaction,
    convertFEtoBETransaction
} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {TransactionDataListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {Button, Modal, Table} from "react-bootstrap";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";

const exampleTransactions: TransactionData[] = [
    {
        id: 1,
        stockId: 1,
        amount: 100,
        type: 'buy',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 1, 1),
        currency: 'HKD',
    },
    {
        id: 2,
        stockId: 1,
        amount: 200,
        type: 'scrip_dividend',
        amountPerShare: 1,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 4, 13),
        currency: "HKD",
    },
    {
        id: 3,
        stockId: 1,
        amount: 300,
        type: 'sell',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 6, 21),
        currency: 'HKD',
    }
];

const PortfolioPage = () => {

    let params = useParams();

    const [stockData, setStockData] = useState<StockData | null>(null);

    const [transactionData, setTransactionData] = useState<TransactionDataListItem[]>(() => processTransactionData(exampleTransactions));
    const [newTransactionData, setNewTransactionData] = useState<NewTransactionInputs>(resetNewTransactionData());

    const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);

    useEffect(() => {

        const getStock = async () => {

            if (!params.id) return null;

            const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(params.id);

            if (response.status === APIStatus.SUCCESS) {

                if (response.data.length !== 1) console.error('More than one stock data found...');

                setStockData(response.data[0]);
            } //Handle error if have
        }

        getStock();
    }, []);

    useEffect(() => {

        if (!stockData) return;

        //TODO: fetch transaction data for selected stock data
        //skip while making templates
        const getTransactions = async () => {

            const response: APIResponse<TransactionDataBE[]> = await StockTransactionAPI.getStockTransactions(stockData.id);

            //TODO: make a mapping function for backend objects to front end
            if (response.status === APIStatus.SUCCESS) {

                const transactionData: TransactionData[] = response.data.map((data: TransactionDataBE): TransactionData => convertBEtoFETransaction(data));

                const transactionDataLineItems: TransactionDataListItem[] = processTransactionData(transactionData);
                setTransactionData(transactionDataLineItems);
            }//Handle if failed to retrieve
        }

        getTransactions();
        setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});
    }, [stockData]);

    return (
        <>
            {/*<Alert TODO: MOVE TO USE CONTEXT*/}
            {/*    show={showStockNotLoadedAlert}*/}
            {/*    variant='danger'*/}
            {/*    onClose={() => setShowStockNotLoadedAlert(false)}*/}
            {/*    className='position-sticky'*/}
            {/*    dismissible*/}
            {/*>*/}
            {/*    Stock Data not loaded properly! Please refresh!*/}
            {/*</Alert>*/}
            <Container fluid>
                <h1>Portfolio Page - {params.id}</h1>

                <Button onClick={() => {

                    if (!stockData?.id) {

                        // setShowStockNotLoadedAlert(true);
                        return;
                    }

                    setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});
                    setShowNewTransactionModal(true)
                }}>
                    New +
                </Button>
                {transactionData && <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Fee</th>
                            <th>Transaction Date</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        transactionData.map((element, index) => {

                            return (
                                <tr key={element.id}>
                                    <td>{index + 1}</td>
                                    <td>{element.type}</td>
                                    <td>{element.quantity}</td>
                                    <td>{element.amount}</td>
                                    <td>{element.fee}</td>
                                    <td>{dateToStringConverter(element.transactionDate)}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </Table>}
                <Modal show={showNewTransactionModal} onHide={() => setShowNewTransactionModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add new transaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <NewTransactionComponent sourceObject={newTransactionData} updateSource={setNewTransactionData} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowNewTransactionModal(false)}>
                            Close
                        </Button>
                        <Button variant='primary' onClick={async () => {

                            //validate input and generate correct values

                            //generate the value
                            const td = convertFEtoBETransaction(newTransactionData);
                            console.log(td);
                            //send to back end
                            const response = await StockTransactionAPI.postStockTransactions(td);
                            if (response.status === APIStatus.FAIL) {
                                console.error('Failed to create transaction: ' + response.data);
                                return;
                            }

                            //set the id of the transaction - assume only 1
                            td.id = response.data[0];
                            //parse response and append to list
                            let newArray: TransactionData[] = [...transactionData];
                            newArray.unshift(convertBEtoFETransaction(td));
                            setTransactionData(processTransactionData(newArray));
                            //just clear extra here in case
                            if (stockData?.id) setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});

                            setShowNewTransactionModal(false);
                        }}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </>
    );
}

const processTransactionData: (transactionData: TransactionData[]) => TransactionDataListItem[] = (transactionData: TransactionData[]): TransactionDataListItem[] => {

    return transactionData.map((element: TransactionData, index: number): TransactionDataListItem => {
        return ({
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys,
            editObject: {
                stockId: element.stockId,
                type: element.type,
                amtWFee: (Number(element.amount ?? 0) + Number(element.fee ?? 0)).toFixed(2),
                amtWOFee: (element.amount ?? 0).toString(),
                quantity: (element.quantity ?? 0).toString(),
                transactionDate: dateToStringConverter(element.transactionDate),
                currency: element.currency
            }
        }) as TransactionDataListItem;
    });
}

const resetNewTransactionData: () => NewTransactionInputs = (): NewTransactionInputs => {

    return {
        stockId: 0,
        type: 'buy',
        transactionDate: '',
        amtWOFee: '',
        amtWFee: '',
        quantity: '',
        currency: 'HKD'
    }
}

export {
    PortfolioPage
}