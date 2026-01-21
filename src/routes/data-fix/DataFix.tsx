import Container from "react-bootstrap/Container";
import {Badge, Button, Col, Row, Stack} from "react-bootstrap";
import {ShortData, StockData} from "#root/src/routes/portfolio-diary/types.js";
import {ReactElement, useEffect, useState} from "react";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.js";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import {APIResponse} from "#root/src/types.ts";
import * as ShortAPI from "#root/src/apis/ShortDataAPI.ts";

// const data1: string[] = [
//     '00001',
//     '00002',
//     '00003',
// ]
//
// const data2: ShortData[] = [
//     {
//         id: 1,
//         stockId: null,
//         shortedShares: 100,
//         shortedAmount: 123,
//         reportingDate: new Date(2025, 1, 1),
//         tickerNo: '00001'
//     },
//     {
//         id: 2,
//         stockId: null,
//         shortedShares: 100,
//         shortedAmount: 123,
//         reportingDate: new Date(2025, 1, 1),
//         tickerNo: '00001'
//     },
//     {
//         id: 3,
//         stockId: null,
//         shortedShares: 100,
//         shortedAmount: 123,
//         reportingDate: new Date(2025, 1, 1),
//         tickerNo: '00002'
//     },
//     {
//         id: 4,
//         stockId: null,
//         shortedShares: 100,
//         shortedAmount: 123,
//         reportingDate: new Date(2025, 1, 1),
//         tickerNo: '00003'
//     }
// ]

const DataFixPage = () => {

    const [tickersWithUnparentedShorts, setTickersWithUnparentedShorts] = useState<string[]>([]);
    const [selectedTicker, setSelectedTicker] = useState<string>('');

    const [unparentedShortData, setUnparentedShortData] = useState<ShortData[]>([]);
    const [selectedChildren, setSelectedChildren] = useState<number[]>([]);

    const [fixStockData, setFixStockData] = useState<StockData | null>();

    useEffect(() => {

        const getTickerList = async () => {

            const response: APIResponse<string[]> = await ShortAPI.getShortDataTickersWithNoStock(10, 0);

            setTickersWithUnparentedShorts(response.data);
        }

        getTickerList();
    }, []);

    useEffect(() => {

        if (selectedTicker === '') return;

        const getUnparentedShortsList = async () => {

            const response: APIResponse<ShortData[]> = await ShortAPI.getShortDataWithNoStock(selectedTicker);

            console.log(response.data);
            setUnparentedShortData(response.data);
        }

        getUnparentedShortsList();
    }, [selectedTicker]);

    useEffect(() => {

        //reset state
        setSelectedChildren([]);
        setFixStockData(null);
    }, [selectedTicker]);

    //TODO: Cleanup by splitting up components - its too ass rn
    return (
        <Container fluid>
            <h1>Fix the data</h1>
            <Row>
                <Col>
                    <Container>
                        <h3>Pending Fix</h3>
                        <Stack
                            className='border'
                        >
                            {tickersWithUnparentedShorts.map((element, index) => (
                                <div
                                    key={`${element}_${index}`}
                                    className={`p-2 border ${selectedTicker === element ? 'bg-secondary': ''}`}
                                    onClick={() => setSelectedTicker(element)}
                                >
                                    {element}
                                </div>
                            ))}
                        </Stack>
                    </Container>
                </Col>
                <Col>
                    <h3>Children</h3>
                    <div
                        className='border'
                    >
                        <Container
                            className='p-2 mb-1 border-bottom shadow'
                        >
                            <Row>
                                <Col>
                                    <div
                                        className='d-flex align-items-center'
                                    >
                                        <FilterableSelect
                                            queryFn={async (args: string): Promise<StockData[]> => {

                                                const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(args);

                                                return response.data;
                                            }}
                                            onSelect={(selectedStock: StockData): void => setFixStockData(selectedStock)}
                                            setInputValue={(selectedStock: StockData): string => selectedStock.name}
                                            renderItem={(data: StockData): ReactElement => (
                                                <div
                                                    className='d-flex flex-column'
                                                >
                                                    <div
                                                        className='d-flex flex-row justify-content-between'
                                                    >
                                                        <span className='main-text'>{ data.name }</span>
                                                        { data.is_active && <Badge bg='success' className='align-content-center'>Active</Badge> }
                                                    </div>
                                                    <div className='sub-text'>{ data.ticker_no }</div>
                                                </div>
                                            )}
                                            initialValue={selectedTicker}
                                            className='me-1 w-100'
                                        />
                                        <Button
                                            disabled={selectedChildren.length === 0 || !fixStockData}
                                            onClick={() => null}
                                        >
                                            Set
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div>Name: {`${fixStockData ? fixStockData.name : ''}`}</div>
                                    <div>Ticker: {`${fixStockData ? fixStockData.ticker_no : ''}`}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button
                                        variant='danger my-1'
                                        onClick={() => setSelectedChildren([])}
                                    >
                                        Clear
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                        <Stack>
                            {unparentedShortData
                                .filter(element => element.tickerNo === selectedTicker)
                                .map((element, index) => (
                                    <div
                                        key={`${element.tickerNo}_${element.id}_${index}`}
                                        className={`p-2 border ${selectedChildren.includes(element.id) ? 'bg-secondary': ''}`}
                                        onClick={() => {

                                            if (!element.id) return;

                                            if (selectedChildren.includes(element.id)) {

                                                const removalIndex = selectedChildren.indexOf(element.id);
                                                if (removalIndex < 0) return;
                                                setSelectedChildren(selectedChildren.toSpliced(removalIndex, 1));
                                            } else {

                                                setSelectedChildren([...selectedChildren, element.id]);
                                            }
                                        }}
                                    >
                                        {`${element.id} | ${dateToStringConverter(element.reportingDate)} | ${ element.shortedShares.toLocaleString()}`}
                                        {element.stockId && <Badge bg='success'>Set!</Badge>}
                                    </div>
                                ))}
                        </Stack>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export {
    DataFixPage
}