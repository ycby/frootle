import './PortfolioDiary.css';
import {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import {useEffect, useState} from "react";
import {
    TransactionData,
    DiaryEntryData,
    StockData
} from "#root/src/routes/portfolio-diary/types.ts";

import {APIStatus, APIResponse} from "#root/src/types.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import {Button, Form, Modal, Stack} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import {FilterableSelectData} from "#root/src/helpers/filterable-select/FilterableSelectItem.tsx";

type StockDataContainerItem = SectionContainerItem & StockData;

export type DiaryEntryListItem = ListItem & DiaryEntryData;

export type TransactionDataListItem = ListItem & TransactionData;

const exampleStocks: StockDataContainerItem[] = [
    {
        id: 1,
        ticker_no: '00001',
        name: 'Stock 1',
        title: '00001'
    },
    {
        id: 2,
        ticker_no: '00002',
        name: 'Stock 2',
        title: '00002'
    },
    {
        id: 3,
        ticker_no: '00003',
        name: 'Stock 3',
        title: '00003'
    }
]

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockDataContainerItem[]>(exampleStocks);

    const [searchTerm, setSearchTerm] = useState('');

    //use ref for performance
    const [hasNewTrackedStockCreated, setHasNewTrackedStockCreated] = useState<number>(0);

    const [showTrackNewStock, setShowTrackNewStock] = useState<boolean>(false);

    const [newTrackedStock, setNewTrackedStock] = useState<FilterableSelectData | null>(null);

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
                                    key={element.id} style={{height: '9rem', minWidth: '10rem'}}
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
                        queryFn={async (args: string) => {

                            const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(args);
                            //TODO: handle the fail state
                            return response.data.map((data: StockData): FilterableSelectData => {

                                return ({
                                    label: data.name,
                                    value: data.id.toString(),
                                    subtext: data.ticker_no
                                } as FilterableSelectData);
                            });
                        }}
                        onSelect={ (selectedValue: FilterableSelectData) => setNewTrackedStock(selectedValue) }
                    />
                    <Stack gap={2} className='mt-2'>
                        <div>Name: {newTrackedStock?.label}</div>
                        <div>Ticker: {newTrackedStock?.subtext}</div>
                    </Stack>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => setShowTrackNewStock(false)}>
                        Close
                    </Button>
                    <Button onClick={async () => {

                        if (!newTrackedStock) return;
                        if (!newTrackedStock.value) return;

                        const result = await StockAPI.setTrackedStock(Number(newTrackedStock.value));

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