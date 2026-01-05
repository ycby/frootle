import Container from 'react-bootstrap/Container';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIResponse, APIStatus, ComponentStatus, ComponentStatusKeys} from "#root/src/types.ts";
import {
    DiaryEntryBE, DiaryEntryData,
    NewTransactionInputs,
    StockData,
    TransactionData,
    TransactionDataBE
} from "#root/src/routes/portfolio-diary/types.ts";
import * as StockTransactionAPI from "#root/src/apis/StockTransactionAPI.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import {
    convertBEtoFEDiaryEntry,
    convertBEtoFETransaction, convertFEtoBEDiaryEntry,
    convertFEtoBETransaction, convertTransactionToNewTransaction
} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {DiaryEntryListItem, TransactionDataListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {Button, Modal, Stack, Tab, Table, Tabs} from "react-bootstrap";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import {Chart, Point, registerables} from "chart.js";
import {Line} from "react-chartjs-2";
import Card from "react-bootstrap/Card";
import * as DiaryEntryAPI from "#root/src/apis/DiaryEntryAPI.ts";
import NewDiaryEntry from "#root/src/routes/portfolio-diary/new-diary-entry/NewDiaryEntry.tsx";
import {MdModeEdit} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";

const exampleTransactions: TransactionData[] = [
    {
        id: 1,
        stockId: 1,
        amount: "100.00",
        type: 'buy',
        amountPerShare: "10.00",
        quantity: 5,
        fee: "0.10",
        transactionDate: new Date(2025, 1, 1),
        currency: 'HKD',
    },
    {
        id: 2,
        stockId: 1,
        amount: "200.00",
        type: 'scrip_dividend',
        amountPerShare: "1.00",
        quantity: 5,
        fee: "0.10",
        transactionDate: new Date(2025, 4, 13),
        currency: "HKD",
    },
    {
        id: 3,
        stockId: 1,
        amount: "300.00",
        type: 'sell',
        amountPerShare: "10.00",
        quantity: 5,
        fee: "0.10",
        transactionDate: new Date(2025, 6, 21),
        currency: 'HKD',
    }
];

const exampleDiaryEntry: DiaryEntryData[] = [
    {
        id: 1,
        stockId: 1,
        title: 'Initial thoughts',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. ',
        postedDate: new Date(2025, 1, 1)
    },
    {
        id: 2,
        stockId: 1,
        title: 'Update 1',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. ',
        postedDate: new Date(2025, 2, 1)
    },
    {
        id: 3,
        stockId: 1,
        title: 'Update 2',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. ',
        postedDate: new Date(2025, 3, 1)
    }
];

type DeletionObject = {
    id: number,
    type: string
}

const PortfolioPage = () => {

    let params = useParams();

    const [stockData, setStockData] = useState<StockData | null>(null);

    const [transactionData, setTransactionData] = useState<TransactionDataListItem[]>(() => processTransactionData(exampleTransactions));
    const [newTransactionData, setNewTransactionData] = useState<NewTransactionInputs>(resetNewTransactionData());

    const [diaryEntries, setDiaryEntries] = useState<DiaryEntryListItem[]>(() => processDiaryEntries(exampleDiaryEntry));
    const [newDiaryEntry, setNewDiaryEntry] = useState<DiaryEntryData>(resetDiaryEntryData());

    const [deletionObject, setDeletionObject] = useState<DeletionObject | null>(null);

    const [dataPoints, setDataPoints] = useState<Point[]>([]);

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showDiaryEntryModal, setShowDiaryEntryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    let navigate = useNavigate();

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

                const transactionDataLineItems: TransactionDataListItem[] = processTransactionData(transactionData).sort(transactionSortingFn);
                setTransactionData(transactionDataLineItems);
            }//Handle if failed to retrieve
        }

        getTransactions();
        setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});
    }, [stockData]);

    useEffect(() => {

        if (!stockData) return;

        const getDiaryEntries = async () => {

            const response: APIResponse<DiaryEntryBE[]> = await DiaryEntryAPI.getDiaryEntries(stockData.id);

            if (response.status === APIStatus.SUCCESS) {

                const diaryEntryData: DiaryEntryData[] = response.data.map((data: DiaryEntryBE): DiaryEntryData => convertBEtoFEDiaryEntry(data));

                const diaryEntryLineItems: DiaryEntryListItem[] = processDiaryEntries(diaryEntryData);
                setDiaryEntries(diaryEntryLineItems);
            }//Handle if failed to retrieve
        }

        getDiaryEntries();
    }, [stockData]);

    useEffect(() => {

        setDataPoints(getHoldingsOverTimeSeries(transactionData));
    }, [transactionData]);

    Chart.register(...registerables,
        {
            id: 'vertical-line'
        }
    );
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
                <Button variant='link' onClick={() => navigate(-1)}>
                    Back
                </Button>
                <div className='d-flex justify-content-between'>
                    <h1>Portfolio Page - {params.id}</h1>
                    <Button
                        variant='outline-danger'
                        onClick={() => {

                            if (!stockData?.id) return;

                            setDeletionObject({id: stockData?.id, type: 'stock'});
                            setShowDeleteModal(true);
                    }}>
                        Unfollow
                    </Button>
                </div>
                <Tabs defaultActiveKey='transactions' className="mb-3">
                    <Tab eventKey='transactions' title='Transactions'>
                        <Line
                            data={{
                                datasets: [
                                    {
                                        label: 'Quantity',
                                        data: dataPoints
                                    }
                                ]
                            }}
                            options={{
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'month',
                                            tooltipFormat: 'dd-MM-yyyy',
                                            displayFormats: {
                                                month: 'MM/yy'
                                            }
                                        }
                                    },
                                    y: {
                                        min: 0,
                                    }
                                }
                            }}
                        />
                        <Button
                            className='mt-3 mb-2'
                            onClick={() => {

                            if (!stockData?.id) {

                                // setShowStockNotLoadedAlert(true);
                                return;
                            }

                            setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});
                            setShowTransactionModal(true)
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
                                    <th></th>
                                    <th></th>
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
                                            <td>
                                                <MdModeEdit
                                                    role='button'
                                                    className='me-2'
                                                    onClick={() => {

                                                        setNewTransactionData(convertTransactionToNewTransaction(element));
                                                        setShowTransactionModal(true);
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <IoMdTrash
                                                    role='button'
                                                    className='me-2'
                                                    onClick={() => {

                                                        //handle error here - no id?
                                                        if (!element?.id) return;

                                                        setDeletionObject({id: element.id, type: 'transaction'});
                                                        setShowDeleteModal(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </Table>}
                    </Tab>
                    <Tab eventKey='diary' title='Diary'>
                        <Button onClick={() => {

                            if (!stockData?.id) {

                                // setShowStockNotLoadedAlert(true);
                                return;
                            }

                            setNewDiaryEntry({...resetDiaryEntryData(), stockId: stockData.id});
                            setShowDiaryEntryModal(true)
                        }}>
                            New +
                        </Button>
                        <Stack gap={3} className='mt-3'>
                            {diaryEntries.map((element) => {

                                return (
                                    <Card key={element.id}>
                                        <Card.Header className='d-flex justify-content-between'>
                                            <div>
                                                {element.title}
                                            </div>
                                            <div className='text-muted'>
                                                {dateToStringConverter(element.postedDate)}
                                            </div>
                                        </Card.Header>
                                        <Card.Body className='position-relative'>
                                            <div className='position-absolute top-0 end-0'>
                                                <MdModeEdit
                                                    role='button'
                                                    className='me-2'
                                                    onClick={() => {

                                                        setNewDiaryEntry(element);
                                                        setShowDiaryEntryModal(true);
                                                    }} />
                                                <IoMdTrash
                                                    role='button'
                                                    className='me-2'
                                                    onClick={() => {

                                                        //handle error here - no id?
                                                        if (!element?.id) return;
                                                        setDeletionObject({id: element.id, type: 'diary'});

                                                        setShowDeleteModal(true);
                                                    }}
                                                />
                                            </div>
                                            <Card.Text>
                                                {element.content}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </Stack>
                    </Tab>
                </Tabs>
            </Container>
            <Modal show={showTransactionModal} onHide={() => setShowTransactionModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${newTransactionData.id ? 'Edit' : 'Add new'} transaction`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewTransactionComponent sourceObject={newTransactionData} updateSource={setNewTransactionData} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowTransactionModal(false)}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={async () => {

                        //generate the value
                        const td = convertFEtoBETransaction(newTransactionData);
                        console.log(td);
                        //send to back end
                        const response = td.id ? await StockTransactionAPI.putStockTransaction(td.id, td) : await StockTransactionAPI.postStockTransactions(td);
                        if (response.status === APIStatus.FAIL) {
                            console.error('Failed to create transaction: ' + response.data);
                            return;
                        }

                        //set the id of the transaction - assume only 1
                        if (!td?.id) td.id = response.data[0];
                        //parse response and append to list
                        let newArray: TransactionData[] = [...transactionData];

                        //remove by id if exists
                        const editedIndex = newArray.findIndex(element => element.id === td.id);
                        if (editedIndex !== -1) newArray.splice(editedIndex, 1);

                        newArray.unshift(convertBEtoFETransaction(td));
                        setTransactionData(processTransactionData(newArray).sort(transactionSortingFn));

                        //just clear extra here in case
                        if (stockData?.id) setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});

                        setShowTransactionModal(false);
                    }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDiaryEntryModal} onHide={() => setShowDiaryEntryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${newDiaryEntry.id ? 'Edit' : 'Add new'} diary entry`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NewDiaryEntry sourceObject={newDiaryEntry} updateSource={setNewDiaryEntry} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDiaryEntryModal(false)}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={async () => {

                        //validate input and generate correct values

                        //generate the value
                        const de = convertFEtoBEDiaryEntry(newDiaryEntry);
                        console.log(de);

                        //send to back end
                        const response = de.id ? await DiaryEntryAPI.putDiaryEntry(de.id, de) : await DiaryEntryAPI.postDiaryEntries(de);

                        if (response.status === APIStatus.FAIL) {
                            console.error('Failed to create diary entry: ' + response.data);
                            return;
                        }

                        //set the id of the transaction - assume only 1
                        if (!de?.id) de.id = response.data[0];
                        //parse response and append to list
                        let newArray: DiaryEntryData[] = [...diaryEntries];

                        //new items won't impact the array since the id won't be found in the array
                        const editedIndex = newArray.findIndex(element => element.id === de.id);
                        if (editedIndex !== -1) newArray.splice(editedIndex, 1);
                        newArray.unshift(convertBEtoFEDiaryEntry(de));
                        setDiaryEntries(processDiaryEntries(newArray).sort(diaryEntrySortingFn));
                        //just clear extra here in case
                        if (stockData?.id) setNewDiaryEntry({...resetDiaryEntryData(), stockId: stockData.id});

                        setShowDiaryEntryModal(false);
                    }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{`${getDeleteModalTitle(deletionObject?.type)}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
                        Close
                    </Button>
                    <Button variant='danger' onClick={async () => {

                        //handle error throwing?
                        if (!deletionObject?.id) return;

                        switch (deletionObject?.type) {
                            case 'stock':

                                const stockResult = await StockAPI.setUntrackedStock(deletionObject.id);

                                if (stockResult.status === APIStatus.FAIL) {
                                    //TODO: handle fail case
                                }

                                if (stockResult.status === APIStatus.SUCCESS) {
                                    setShowDeleteModal(false);
                                    navigate('/');
                                }

                                break;
                            case 'transaction':

                                const transactionResult = await StockTransactionAPI.deleteStockTransaction(deletionObject.id);

                                if (transactionResult.status === APIStatus.FAIL) {
                                    //TODO: handle fail case
                                }

                                if (transactionResult.status === APIStatus.SUCCESS) {

                                    let newArray: TransactionData[] = [...transactionData];

                                    //new items won't impact the array since the id won't be found in the array
                                    const editedIndex = newArray.findIndex(element => element.id === element.id);
                                    if (editedIndex !== -1) newArray.splice(editedIndex, 1);

                                    setTransactionData(processTransactionData(newArray));

                                    setShowDeleteModal(false);
                                    //success alert?
                                }
                                break;
                            case 'diary':

                                const diaryResult = await DiaryEntryAPI.deleteDiaryEntry(deletionObject.id);

                                if (diaryResult.status === APIStatus.FAIL) {
                                    //TODO: handle fail case
                                }

                                if (diaryResult.status === APIStatus.SUCCESS) {

                                    let newArray: DiaryEntryData[] = [...diaryEntries];

                                    //new items won't impact the array since the id won't be found in the array
                                    const editedIndex = newArray.findIndex(element => element.id === deletionObject.id);
                                    if (editedIndex !== -1) newArray.splice(editedIndex, 1);

                                    setDiaryEntries(processDiaryEntries(newArray));

                                    setShowDeleteModal(false);
                                    //success alert?
                                }
                                break;
                            default:
                                //error alert?
                                break;
                        }
                        setDeletionObject(null);
                    }}>
                        {`${getDeleteModalButtonText(deletionObject?.type)}`}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

const processTransactionData: (transactionData: TransactionData[]) => TransactionDataListItem[] = (transactionData: TransactionData[]): TransactionDataListItem[] => {

    return transactionData.map((element: TransactionData, index: number): TransactionDataListItem => {
        return ({
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys
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

const processDiaryEntries: (diaryEntries: DiaryEntryData[]) => DiaryEntryListItem[] = (diaryEntries: DiaryEntryData[]): DiaryEntryListItem[] => {

    return diaryEntries.map((element: DiaryEntryData, index: number) => {

        return {
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys
        }
    });
}

const resetDiaryEntryData: () => DiaryEntryData = (): DiaryEntryData => {

    return {
        stockId: 0,
        title: '',
        content: '',
        postedDate: new Date(),
    }
}

const transactionSortingFn: (a: TransactionData, b: TransactionData) => number = (a: TransactionData, b: TransactionData):number => {

    return b.transactionDate.getTime() - a.transactionDate.getTime();
}

const diaryEntrySortingFn: (a: DiaryEntryData, b: DiaryEntryData) => number = (a: DiaryEntryData, b: DiaryEntryData):number => {

    return b.postedDate.getTime() - a.postedDate.getTime();
}

const getDeleteModalTitle: (type: string | undefined) => string = (type: string | undefined): string => {

    switch (type) {
        case 'transaction':
            return 'Delete transaction';
        case 'diary':
            return 'Delete diary entry';
        case 'stock':
            return 'Unfollow stock';
        default:
            return 'Unknown';
    }
};

const getDeleteModalButtonText: (type: string | undefined) => string = (type: string | undefined): string => {

    switch (type) {
        case 'transaction':
            return 'Delete';
        case 'diary':
            return 'Delete';
        case 'stock':
            return 'Unfollow';
        default:
            return 'Unknown';
    }
};


const getHoldingsOverTimeSeries = (transactionData: TransactionData[]): Point[] => {

    let accumulator: number = 0;

    return transactionData.toReversed().map((element): Point => {

        switch (element.type) {
            case 'buy':
                accumulator += element.quantity;
                break;
            case 'sell':
                accumulator -= element.quantity;
                break;
            case 'scrip_dividend':
                accumulator += element.quantity;
                break;
            default:
                break;
        }

        return ({
            x: element.transactionDate.valueOf(),
            y: accumulator
        });
    });
}

export {
    PortfolioPage
}