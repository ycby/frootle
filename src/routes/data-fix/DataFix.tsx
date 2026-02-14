import Container from "react-bootstrap/Container";
import {Badge, Button, Col, Row, Stack} from "react-bootstrap";
import {ShortData, StockData} from "#root/src/routes/portfolio-diary/types.js";
import {ReactElement, useEffect, useRef, useState} from "react";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.js";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import {APIResponse, APIStatus} from "#root/src/types.ts";
import * as ShortAPI from "#root/src/apis/ShortDataAPI.ts";
import {useAlert} from "#root/src/helpers/alerts/AlertContext.tsx";
import {WrappedPagination} from "#root/src/helpers/pagination/WrappedPagination.tsx";

type MismatchTickerResponse = {
    total_rows: string;
    tickers: string[];
    offset: number;
    limit: number;
}

const DataFixPage = () => {

    const [tickersWithUnparentedShorts, setTickersWithUnparentedShorts] = useState<string[]>([]);
    const [selectedTicker, setSelectedTicker] = useState<string>('');

    const [unparentedShortData, setUnparentedShortData] = useState<ShortData[]>([]);
    const [selectedChildrenIndex, setSelectedChildrenIndex] = useState<number[]>([]);

    const [fixStockData, setFixStockData] = useState<StockData | null>();
    const totalRows = useRef<number>(0);

    const {
        addAlert
    } = useAlert();

    const getTickerList = async (limit: number = 10, offset: number = 0) => {

        const response: APIResponse<MismatchTickerResponse> = await ShortAPI.getShortDataTickersWithNoStock(limit, offset);

        setTickersWithUnparentedShorts(response.data.tickers);
        totalRows.current = Number(response.data.total_rows);
    }
    useEffect(() => {

        getTickerList(10, 0);
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
        setSelectedChildrenIndex([]);
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
                        <WrappedPagination
                            totalRows={totalRows.current}
                            limit={10}
                            onPageClick={(pageNumber: number) => getTickerList(10, (pageNumber - 1) * 10)}
                        />
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

                                                return response.data.toSorted((a, _b) => a.isActive ? -1 : 1);
                                            }}
                                            onSelect={(selectedStock: StockData): void => setFixStockData(selectedStock)}
                                            setInputValue={(selectedStock: StockData): string => selectedStock.tickerNo}
                                            renderItem={(data: StockData): ReactElement => (
                                                <div
                                                    className='d-flex flex-column'
                                                >
                                                    <div
                                                        className='d-flex flex-row justify-content-between'
                                                    >
                                                        <span className='main-text'>{ data.name }</span>
                                                        { Boolean(data.isActive) && <Badge bg='success' className='align-content-center'>Active</Badge> }
                                                    </div>
                                                    <div className='sub-text'>{ data.tickerNo }</div>
                                                </div>
                                            )}
                                            initialValue={selectedTicker}
                                            className='me-1 w-100'
                                            disabled={!selectedTicker}
                                        />
                                        <Button
                                            disabled={selectedChildrenIndex.length === 0 || !fixStockData}
                                            onClick={() => {

                                                //set alert here
                                                if (fixStockData === null) return;
                                                if (!fixStockData?.id) return;

                                                const newShortDataList = [...unparentedShortData];

                                                selectedChildrenIndex.forEach((element) => {
                                                    //TODO: change types to match expected bigint now (string)
                                                    newShortDataList[element].stockId = fixStockData.id.toString();
                                                });

                                                setUnparentedShortData(newShortDataList);
                                            }}
                                        >
                                            Set
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div>Name: {`${fixStockData ? fixStockData.name : ''}`}</div>
                                    <div>Ticker: {`${fixStockData ? fixStockData.tickerNo : ''}`}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className='d-flex justify-content-between'>
                                        <Button
                                            variant='danger my-1'
                                            onClick={() => {
                                                setUnparentedShortData(unparentedShortData.map((element: ShortData): ShortData => ({...element, stockId: undefined})));
                                                setSelectedChildrenIndex([]);
                                            }}
                                        >
                                            Clear
                                        </Button>
                                        <Button
                                            variant='primary'
                                            onClick={() => {
                                                setSelectedChildrenIndex(unparentedShortData.map((_element, index) => index));
                                            }}
                                        >
                                            Select All
                                        </Button>
                                        <Button
                                            variant='primary'
                                            disabled={selectedChildrenIndex.length === 0 || !fixStockData}
                                            onClick={async () => {

                                                const shortDataToUpdate: ShortData[] = unparentedShortData.filter(element => element.stockId !== null && element.stockId !== undefined);

                                                if (shortDataToUpdate.length === 0) {
                                                    addAlert({
                                                        message: 'No Short Data to sync! Please set the parent Stock first!',
                                                        type: 'warning',
                                                        duration: 8000
                                                    });
                                                    return;
                                                }

                                                const response = await ShortAPI.putShortData(shortDataToUpdate);

                                                if (response.status === APIStatus.SUCCESS) {
                                                    //set alert here
                                                    addAlert({
                                                        name: 'Short Data saved successfully!',
                                                        message: 'Short Data saved successfully!',
                                                        type: 'success',
                                                        duration: 5000
                                                    });
                                                    //disappear them
                                                    console.log('Successful PUT!');
                                                    setUnparentedShortData(unparentedShortData.filter((element) => element.stockId === null || element.stockId === undefined));
                                                    setSelectedChildrenIndex([]);
                                                } else {
                                                    //set fail alert here
                                                    addAlert({
                                                        name: 'Short Data failed to save!',
                                                        message: 'Short Data failed to save!',
                                                        type: 'danger',
                                                        duration: 5000
                                                    });
                                                    //do NOT disappear them
                                                    console.error('Failed PUT!');
                                                }
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                        <Stack>
                            {unparentedShortData
                                .filter(element => element.tickerNo === selectedTicker)
                                .map((element, index) => (
                                    <div
                                        key={`${element.tickerNo}_${element.id}_${index}`}
                                        className={`p-2 border d-flex justify-content-between user-select-none ${selectedChildrenIndex.includes(index) ? 'bg-secondary': ''}`}
                                        onClick={() => {

                                            if (!element.id) return;

                                            if (selectedChildrenIndex.includes(index)) {

                                                const removalIndex = selectedChildrenIndex.indexOf(index);
                                                if (removalIndex < 0) return;
                                                setSelectedChildrenIndex(selectedChildrenIndex.toSpliced(removalIndex, 1));
                                            } else {

                                                setSelectedChildrenIndex([...selectedChildrenIndex, index]);
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