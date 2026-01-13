import Container from "react-bootstrap/Container";
import {Col, Row, Stack} from "react-bootstrap";
import {ShortData} from "#root/src/routes/portfolio-diary/types.js";
import {useState} from "react";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.js";

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

    return (
        <Container fluid>
            <h1>Fix the data</h1>
            <Row>
                <Col>
                    <Stack>
                        {data1.map((element, index) => (
                            <div
                                key={`${element}_${index}`}
                                className='p-2 border'
                                onClick={() => setSelectedTicker(element)}
                            >
                                {element}
                            </div>
                        ))}
                    </Stack>
                </Col>
                <Col>
                    <Container>

                    </Container>
                    <Stack>
                        {data2
                            .filter(element => element.tickerNo === selectedTicker)
                            .map((element, index) => (
                                <div
                                    key={`${element.tickerNo}_${element.id}_${index}`}
                                    className='p-2 border'
                                >
                                    {`${element.id} | ${dateToStringConverter(element.reportingDate)} | ${ element.shortedShares}`}
                                </div>
                            ))}
                    </Stack>
                </Col>
            </Row>
        </Container>
    );
}

export {
    DataFixPage
}