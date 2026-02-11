import Container from 'react-bootstrap/Container';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {APIResponse, APIStatus, ComponentStatus, ComponentStatusKeys} from "#root/src/types.ts";
import {
    DiaryEntry,
    NewTransactionInputs,
    StockData,
    TransactionData,
} from "#root/src/routes/portfolio-diary/types.ts";
import * as StockTransactionAPI from "#root/src/apis/StockTransactionAPI.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import {
    convertNewTransactionToTransaction,
    convertTransactionToNewTransaction
} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {DiaryEntryListItem, TransactionDataListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import {Button, Carousel, Modal, Stack, Tab, Table, Tabs} from "react-bootstrap";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import {Chart, Point, registerables} from "chart.js";
import {Line} from "react-chartjs-2";
import Card from "react-bootstrap/Card";
import * as DiaryEntryAPI from "#root/src/apis/DiaryEntryAPI.ts";
import NewDiaryEntry from "#root/src/routes/portfolio-diary/new-diary-entry/NewDiaryEntry.tsx";
import {MdModeEdit} from "react-icons/md";
import {IoMdTrash} from "react-icons/io";

import './PortfolioPage.css';
import {convertZeroesToKorM} from "#root/src/helpers/ChartHelpers.ts";

type DeletionObject = {
    id: string,
    type: string
}

type AggregateObject = {
    expenditure: number,
    income: number,
    fee: number,
    scrip: number,
    cashDiv: number,
    profit: number,
    perShare: number,
    quantity: number
}

const PortfolioPage = () => {

    let params = useParams();

    const [stockData, setStockData] = useState<StockData | null>(null);

    const [transactionData, setTransactionData] = useState<TransactionDataListItem[]>([]);
    const [newTransactionData, setNewTransactionData] = useState<NewTransactionInputs>(resetNewTransactionData());

    const [diaryEntries, setDiaryEntries] = useState<DiaryEntryListItem[]>([]);
    const [newDiaryEntry, setNewDiaryEntry] = useState<DiaryEntry>(resetDiaryEntryData());

    const [aggregateValues, setAggregateValues] = useState<AggregateObject | null>(null);

    const [deletionObject, setDeletionObject] = useState<DeletionObject | null>(null);

    const [quantityDataPoints, setQuantityDataPoints] = useState<Point[]>([]);

    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showDiaryEntryModal, setShowDiaryEntryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    let navigate = useNavigate();
    // const { addAlert } = useAlert(); TODO: use this for alerts

    useEffect(() => {

        const getStock = async () => {

            if (!params.id) return null;

            const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(params.id);

            if (response.status === APIStatus.SUCCESS) {

                if (response.data.length !== 1) console.error('More than one stock data found...');

                setStockData(response.data[0]);
            } //Handle error if error
        }

        getStock();
    }, []);

    useEffect(() => {

        if (!stockData) return;

        //TODO: fetch transaction data for selected stock data
        //skip while making templates
        const getTransactions = async () => {

            const response: APIResponse<TransactionData[]> = await StockTransactionAPI.getStockTransactions(stockData.id);

            //TODO: make a mapping function for backend objects to front end
            if (response.status === APIStatus.SUCCESS) {

                const transactionData: TransactionData[] = response.data;

                const transactionDataLineItems: TransactionDataListItem[] = processTransactionData(transactionData).sort(transactionSortingFn);
                console.log(transactionDataLineItems);
                setTransactionData(transactionDataLineItems);
            }//Handle if failed to retrieve
        }

        getTransactions();
        setNewTransactionData({...resetNewTransactionData(), stockId: stockData.id});
    }, [stockData]);

    useEffect(() => {

        if (!stockData) return;

        const getDiaryEntries = async () => {

            const response: APIResponse<DiaryEntry[]> = await DiaryEntryAPI.getDiaryEntries(stockData.id);

            if (response.status === APIStatus.SUCCESS) {

                const diaryEntryData: DiaryEntry[] = response.data;

                const diaryEntryLineItems: DiaryEntryListItem[] = processDiaryEntries(diaryEntryData);
                setDiaryEntries(diaryEntryLineItems);
            }//Handle if failed to retrieve
        }

        getDiaryEntries();
    }, [stockData]);

    useEffect(() => {

        const transactionDataInTimeOrder = transactionData.toReversed();

        const holdingsOverTime: Point[] = [];
        let quantityAccumulator = 0;

        let totalExpenditure = 0;
        let totalGain = 0;
        let totalProfit = 0;
        let totalFee = 0;
        let totalScrip = 0;
        let totalCashDiv = 0;

        for (let element of transactionDataInTimeOrder) {

            switch (element.type) {
                case 'buy':
                    quantityAccumulator += element.quantity;

                    totalExpenditure += Number(element.amount);
                    break;
                case 'sell':
                    quantityAccumulator -= element.quantity;

                    totalGain += Number(element.amount);
                    break;
                case 'scrip_dividend':
                    quantityAccumulator += element.quantity;

                    totalScrip += Number(element.quantity);
                    break;
                case 'cash_dividend':
                    totalGain += Number(element.amount);
                    totalCashDiv += Number(element.amount);

                    break;
                default:
                    break;
            }

            totalFee += Number(element.fee);

            holdingsOverTime.unshift({
                x: element.transactionDate.valueOf(),
                y: quantityAccumulator
            });
        }

        totalProfit = totalGain - totalExpenditure - totalFee;

        setQuantityDataPoints(holdingsOverTime);
        setAggregateValues({
            expenditure: totalExpenditure,
            income: totalGain,
            fee: totalFee,
            scrip: totalScrip,
            cashDiv: totalCashDiv,
            profit: totalProfit,
            perShare: (totalExpenditure - totalGain) / quantityAccumulator,
            quantity: quantityAccumulator
        });
    }, [transactionData]);

    Chart.register(...registerables,
        {
            id: 'vertical-line'
        }
    );
    return (
        <>
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
                        <Carousel interval={null} data-bs-theme="dark">
                            <Carousel.Item>
                                <Line
                                    data={{
                                        datasets: [
                                            {
                                                label: 'Quantity',
                                                data: quantityDataPoints
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
                                                        month: 'MM-yyyy'
                                                    }
                                                }
                                            },
                                            y: {
                                                min: 0,
                                                ticks: {
                                                    callback: (value, _index, ticks) => convertZeroesToKorM(value as number, ticks[ticks.length - 1].value as number)
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Carousel.Item>
                            <Carousel.Item>
                                <div className='d-flex justify-content-start flex-wrap px-5 row-gap-4'>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Expenditure</h2>
                                        <h4>${aggregateValues?.expenditure.toFixed(2)}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Income</h2>
                                        <h4>${aggregateValues?.income.toFixed(2)}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Profit</h2>
                                        <h4>{aggregateValues && aggregateValues?.profit > 0 ? `$${aggregateValues?.profit.toFixed(2)}` : 'No Profit'}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Fees</h2>
                                        <h4>${aggregateValues?.fee.toFixed(2)}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Scrip</h2>
                                        <h4>{aggregateValues?.scrip}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Cash</h2>
                                        <h4>${aggregateValues?.cashDiv.toFixed(2)}</h4>
                                    </div>
                                    <div
                                        className='d-flex flex-column align-items-center'
                                        style={{maxWidth: '100%', minWidth: '150px', width: '25%'}}
                                    >
                                        <h2 className='text-center'>Cost Basis</h2>
                                        <h4>${aggregateValues?.perShare.toFixed(2)}</h4>
                                    </div>
                                </div>
                            </Carousel.Item>
                        </Carousel>
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
                                            <Card.Text style={{whiteSpace: 'pre-line'}}>
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
                        const td = {...newTransactionData};
                        console.log(td);
                        //send to back end
                        const response = td.id
                            ? await StockTransactionAPI.putStockTransaction({...td, id: td.id})
                            : await StockTransactionAPI.postStockTransactions(td);

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

                        newArray.unshift(convertNewTransactionToTransaction(td));
                        setTransactionData(processTransactionData(newArray).sort(transactionSortingFn));

                        //just clear extra here in case
                        const resetNewTransaction = resetNewTransactionData();
                        if (stockData?.id) resetNewTransaction.stockId = stockData.id;
                        setNewTransactionData(resetNewTransaction);

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
                        const de = {...newDiaryEntry};

                        //send to back end
                        const response = de.id ? await DiaryEntryAPI.putDiaryEntry({...de, id: de.id}) : await DiaryEntryAPI.postDiaryEntries(de);

                        if (response.status === APIStatus.FAIL) {
                            console.error('Failed to create diary entry: ' + response.data);
                            return;
                        }

                        //set the id of the transaction - assume only 1
                        if (!de?.id) de.id = response.data[0];
                        //parse response and append to list
                        let newArray: DiaryEntry[] = [...diaryEntries];

                        //new items won't impact the array since the id won't be found in the array
                        const editedIndex = newArray.findIndex(element => element.id === de.id);

                        if (editedIndex !== -1) newArray.splice(editedIndex, 1);

                        newArray.unshift(de);

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

                                    let newArray: DiaryEntry[] = [...diaryEntries];

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
        id: null,
        stockId: null,
        type: 'buy',
        transactionDate: '',
        amtWOFee: '',
        amtWFee: '',
        quantity: '',
        currency: 'HKD'
    }
}

const processDiaryEntries: (diaryEntries: DiaryEntry[]) => DiaryEntryListItem[] = (diaryEntries: DiaryEntry[]): DiaryEntryListItem[] => {

    return diaryEntries.map((element: DiaryEntry, index: number) => {

        return {
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys
        }
    });
}

const resetDiaryEntryData = (): DiaryEntry => {

    return {
        id: null,
        stockId: null,
        title: '',
        content: '',
        postedDate: new Date(),
    }
}

const transactionSortingFn: (a: TransactionData, b: TransactionData) => number = (a: TransactionData, b: TransactionData):number => {

    return b.transactionDate.getTime() - a.transactionDate.getTime();
}

const diaryEntrySortingFn: (a: DiaryEntry, b: DiaryEntry) => number = (a: DiaryEntry, b: DiaryEntry):number => {

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

export {
    PortfolioPage
}