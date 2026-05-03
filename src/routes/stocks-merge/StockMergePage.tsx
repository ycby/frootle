import {useEffect, useRef, useState} from "react";
import * as StockAPI from '#root/src/apis/StockAPI.ts';
import {APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import {WrappedPagination} from "#root/src/helpers/pagination/WrappedPagination.tsx";
import MultistepForm from "#root/src/components/multistep-container/MultistepForm.tsx";

type StockMergeDataType = {
    ISIN: string;
    children: StockData[];
}

const StockMergePage = () => {

    const [duplicateData, setDuplicateData] = useState<StockMergeDataType[]>([]);

    const [selectedISIN, setSelectedISIN] = useState<string | null>(null);

    const totalRows = useRef<number>(0);

    const getDuplicateData = async (limit: number, offset: number) => {

        const response = await StockAPI.getStockDuplicates(limit, offset);

        if (response.status === APIStatus.SUCCESS) {

            totalRows.current = Number(response.data.total_rows ?? 0);
            setDuplicateData(response.data.data);
        }
    }

    useEffect(() => {

        getDuplicateData(10, 0);
    }, []);

    return (
        <Container fluid>
            <h1>Fix the data</h1>
            <MultistepForm
                title='Merge Stock Duplicates'
                initialStage={0}
                totalStages={3}
            >
                <MultistepForm.Stage
                    index={0}
                    validation={() => selectedISIN !== null}
                >
                    <h5>
                        Which ISIN?
                    </h5>
                    <Stack
                        className='border'
                    >
                        {duplicateData.map((element, index) => (
                            <div
                                key={`${element.ISIN}_${index}`}
                                className={`p-2 border ${selectedISIN === element.ISIN ? 'bg-secondary': ''}`}
                                onClick={() => setSelectedISIN(element.ISIN)}
                            >
                                {element.ISIN}
                            </div>
                        ))}
                    </Stack>
                    <WrappedPagination
                        totalRows={totalRows.current}
                        limit={10}
                        onPageClick={(pageNumber: number) => getDuplicateData(10, (pageNumber - 1) * 10)}
                    />
                </MultistepForm.Stage>
                <MultistepForm.Stage index={1}>Test Body 2</MultistepForm.Stage>
                <MultistepForm.Stage index={2}>Test Body 3</MultistepForm.Stage>
                <MultistepForm.Complete>Test Complete</MultistepForm.Complete>
                <MultistepForm.Controls />
            </MultistepForm>
        </Container>
    )
}

export default StockMergePage;