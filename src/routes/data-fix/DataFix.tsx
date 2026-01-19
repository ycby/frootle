import Container from "react-bootstrap/Container";
import {Button, Col, Row, Stack} from "react-bootstrap";
import {ShortData} from "#root/src/routes/portfolio-diary/types.js";
import {useEffect, useState} from "react";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.js";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";

const data1: string[] = [
    '00001',
    '00002',
    '00003',
]

const data2: ShortData[] = [
    {
        id: 1,
        stockId: null,
        shortedShares: 100,
        shortedAmount: 123,
        reportingDate: new Date(2025, 1, 1),
        tickerNo: '00001'
    },
    {
        id: 2,
        stockId: null,
        shortedShares: 100,
        shortedAmount: 123,
        reportingDate: new Date(2025, 1, 1),
        tickerNo: '00001'
    },
    {
        id: 3,
        stockId: null,
        shortedShares: 100,
        shortedAmount: 123,
        reportingDate: new Date(2025, 1, 1),
        tickerNo: '00002'
    },
    {
        id: 4,
        stockId: null,
        shortedShares: 100,
        shortedAmount: 123,
        reportingDate: new Date(2025, 1, 1),
        tickerNo: '00003'
    }
]

const DataFixPage = () => {

    const [selectedTicker, setSelectedTicker] = useState<string>('');

    const [selectedChildren, setSelectedChildren] = useState<number[]>([]);

    useEffect(() => {

        setSelectedChildren([]);
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
                            {data1.map((element, index) => (
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
                            className='d-flex direction-horizontal justify-content-between align-items-center p-2 mb-1 border-bottom shadow'
                        >
                            <div
                                className='d-flex align-items-center'
                            >
                                <FilterableSelect />
                                <Button>
                                    Set
                                </Button>
                            </div>
                            <Button variant='danger'>
                                Clear
                            </Button>
                        </Container>
                        <Stack>
                            {data2
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
                                        {`${element.id} | ${dateToStringConverter(element.reportingDate)} | ${ element.shortedShares}`}
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