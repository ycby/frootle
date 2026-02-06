import './PortfolioDiary.css';
import {ReactElement, useEffect, useState} from "react";
import {
    TransactionData,
    DiaryEntry,
    StockData, ListItem
} from "#root/src/routes/portfolio-diary/types.ts";

import {APIStatus, APIResponse} from "#root/src/types.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import {Button, Form, Modal, Stack} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import {getRandomNumber} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";

type StockDataContainerItem = StockData & {
    title: string;
};

export type DiaryEntryListItem = DiaryEntry & ListItem;

export type TransactionDataListItem = TransactionData & ListItem;

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockDataContainerItem[]>([]);

    const [searchTerm, setSearchTerm] = useState('');

    //use ref for performance
    const [hasNewTrackedStockCreated, setHasNewTrackedStockCreated] = useState<number>(0);

    const [showTrackNewStock, setShowTrackNewStock] = useState<boolean>(false);

    const [newTrackedStock, setNewTrackedStock] = useState<StockData | null>(null);

    useEffect(() => {

        const getTrackedStocks = async () => {

            const response: APIResponse<StockData[]> = await StockAPI.getTrackedStocks();

            if (response.status === APIStatus.FAIL) {

                console.error('No tracked stocks found');
            }

            //do some processing for response

            const processedData:StockDataContainerItem[] = response.data.map((data: StockData): StockDataContainerItem => {
                return {...data, title: data.ticker_no}
            });

            setStockData(processedData);
        }

        getTrackedStocks();
    }, [hasNewTrackedStockCreated]);

    let navigate = useNavigate();

    return (
        <>
            <Container fluid>
                <Button onClick={() => setShowTrackNewStock(true)}>
                    New +
                </Button>
                <Form className='mt-3'>
                    <Form.Control
                        type='text'
                        placeholder='Filter tracked stocks...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </Form>
                <Stack
                    direction='horizontal'
                    gap={2}
                    className='my-4 justify-content-between flex-wrap'
                    style={{ width: '100%'}}
                >
                    {
                        stockData.filter(element => {

                            if (!searchTerm) return true;

                            return element.ticker_no.includes(searchTerm);
                        }).map(element => {

                            return (
                                <Card
                                    key={element.id}
                                    style={{height: '9rem', minWidth: '10rem', backgroundColor: `rgba(${getRandomNumber(255)}, ${getRandomNumber(255)}, ${getRandomNumber(255)}, ${0.2})`}}
                                    onClick={() => navigate(`/portfolio/${element.ticker_no}`)}
                                    className='stock-card flex-fill'
                                >
                                    <Card.Body>
                                        <Card.Title>{element.ticker_no}-{element.name}</Card.Title>
                                        <Card.Text>Example Text</Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    }
                </Stack>
            </Container>
            <Modal
                show={showTrackNewStock}
                onHide={() => setShowTrackNewStock(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Track new stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FilterableSelect
                        queryFn={async (args: string): Promise<StockData[]> => {

                            const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(args);
                            //TODO: handle the fail state
                            return response.data;
                        }}
                        onSelect={ (selectedValue: StockData) => setNewTrackedStock(selectedValue) }
                        setInputValue={ (data: StockData): string => data.name}
                        renderItem={ (data: StockData): ReactElement => (
                            <>
                                <span className='main-text'>{ data.name }</span>
                                <span className='sub-text'>{ data.ticker_no }</span>
                            </>
                        )}
                    />
                    <Stack gap={2} className='mt-2'>
                        <div>Name: {newTrackedStock?.name}</div>
                        <div>Ticker: {newTrackedStock?.ticker_no}</div>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowTrackNewStock(false)}>
                        Close
                    </Button>
                    <Button onClick={async () => {

                        if (!newTrackedStock) return;
                        if (!newTrackedStock.id) return;

                        const result = await StockAPI.setTrackedStock(Number(newTrackedStock.id));

                        if (result.status === APIStatus.FAIL) {
                            //TODO: handle fail case
                        }

                        if (result.status === APIStatus.SUCCESS) {
                            //learn something new everyday: can provide usestate with function
                            setHasNewTrackedStockCreated(prevState => prevState + 1);
                            setShowTrackNewStock(false);
                        }
                    }}>Follow</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export {
    PortfolioDiary
}