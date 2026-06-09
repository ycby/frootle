import {useEffect, useRef, useState} from "react";
import * as StockAPI from '#root/src/apis/StockAPI.ts';
import {APIStatus} from "#root/src/types.ts";
import {StockData} from "#root/src/routes/portfolio-diary/types.ts";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import {WrappedPagination} from "#root/src/helpers/pagination/WrappedPagination.tsx";
import MultistepForm from "#root/src/components/multistep-container/MultistepForm.tsx";
import CellSelectableTable from "#root/src/components/cell-selectable-table/CellSelectableTable.tsx";
import {mergeStockDuplicates} from "#root/src/apis/StockAPI.ts";
import {useAlert} from "#root/src/helpers/alerts/AlertContext.tsx";

type StockMergeDataType = {
    ISIN: string;
    duplicates: StockData[];
}

const StockFieldMapping = [
    {
        label: 'Id (Master)',
        value: 'id',
        pickable: true,
    },
    {
        label: 'Ticker No',
        value: 'tickerNo',
        pickable: false,
    },
    {
        label: 'Name',
        value: 'name',
        pickable: true
    },
    {
        label: 'Full Name',
        value: 'fullName',
        pickable: true
    },
    {
        label: 'Description',
        value: 'description',
        pickable: true
    },
    {
        label: 'Category',
        value: 'category',
        pickable: true
    },
    {
        label: 'Subcategory',
        value: 'subcategory',
        pickable: true
    },
    {
        label: 'Board Lot',
        value: 'boardLot',
        pickable: true
    },
    {
        label: 'ISIN',
        value: 'ISIN',
        pickable: true
    },
    {
        label: 'Currency',
        value: 'currency',
        pickable: true
    },
    {
        label: 'Active?',
        value: 'isActive',
        pickable: true
    },
    {
        label: 'Created At',
        value: 'createdDatetime',
        pickable: false
    },
    {
        label: 'Updated At',
        value: 'lastModifiedDatetime',
        pickable: false
    }
];

const StockMergePage = () => {

    const [duplicateData, setDuplicateData] = useState<StockMergeDataType[]>([]);

    const [selectedDuplicateGroup, setSelectedDuplicateGroup] = useState<StockMergeDataType | null>(null);
    const [survivor, setSurvivor] = useState<StockData | null>(null);
    const [rejects, setRejects] = useState<StockData[]>([]);

    const limit = useRef<number>(10);
    const offset = useRef<number>(0);

    const {
        addAlert
    } = useAlert();

    const totalRows = useRef<number>(0);

    const getDuplicateData = async (limit: number, offset: number) => {

        const response = await StockAPI.getStockDuplicates(limit, offset);

        if (response.status === APIStatus.SUCCESS) {

            totalRows.current = Number(response.data.total_rows ?? 0);
            setDuplicateData(response.data.data);
        }
    }

    useEffect(() => {

        getDuplicateData(limit.current, offset.current);
    }, []);

    const setSurvivorAndRejects = (data: any[], rowSelection: number[]) => {

        const survivor = {...data[rowSelection[0]]};
        StockFieldMapping.forEach((field, index) => {
            survivor[field.value] = data[rowSelection[index]][field.value];
        });

        setSurvivor(survivor);
        setRejects(data.filter((_element, index) => index !== rowSelection[0]));
    }

    return (
        <Container fluid>
            <h1>Fix the data</h1>
            <MultistepForm
                title='Merge Stock Duplicates'
                initialStage={0}
                totalStages={3}
                onFinish={() => getDuplicateData(0, 10)}
            >
                <MultistepForm.Stage
                    index={0}
                    validation={() => selectedDuplicateGroup !== null}
                    onNext={() => {

                        if (selectedDuplicateGroup === null) return;
                        setSurvivorAndRejects(selectedDuplicateGroup.duplicates, StockFieldMapping.map(() => 0))
                    }}
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
                                className={`p-2 border ${selectedDuplicateGroup?.ISIN === element.ISIN ? 'bg-secondary': ''}`}
                                onClick={() => setSelectedDuplicateGroup(element)}
                            >
                                {element.ISIN}
                            </div>
                        ))}
                    </Stack>
                    <WrappedPagination
                        totalRows={totalRows.current}
                        limit={limit.current}
                        onPageClick={(pageNumber: number) => {

                            offset.current = (pageNumber - 1) * limit.current + offset.current;
                            getDuplicateData(limit.current, offset.current);
                        }}
                    />
                </MultistepForm.Stage>
                <MultistepForm.Stage
                    index={1}
                    onNext={() => {

                        console.log(survivor);
                        console.log(rejects);
                    }}
                >
                    <h5>Selected ISIN: {selectedDuplicateGroup?.ISIN}</h5>
                    {
                        selectedDuplicateGroup?.duplicates ?
                        <CellSelectableTable
                            data={selectedDuplicateGroup?.duplicates}
                            fields={StockFieldMapping}
                            getData={setSurvivorAndRejects}
                        /> :
                        <h6>No valid data for merging? Something went wrong</h6>
                    }
                </MultistepForm.Stage>
                <MultistepForm.Stage
                    index={2}
                    onNext={async () => {

                        //empty return now, but should set alert
                        if (survivor === null) {

                            addAlert({
                                name: 'Missing survivor!',
                                message: 'Seems you are missing a survivor stock when trying to merge stocks',
                                type: 'danger',
                                duration: 5000
                            });

                            return;
                        }

                        const response = await mergeStockDuplicates(survivor, rejects);

                        if (response.status === APIStatus.FAIL) {

                            addAlert({
                                name: 'Error performing merge',
                                message: 'There was an issue merging the records, not the backend',
                                type: 'warning',
                                duration: 5000
                            });

                            //find a way to halt here
                        }
                    }}
                >
                    <h5>Confirm Data</h5>
                    <div>{survivor?.name}</div>
                    <div>{survivor?.description}</div>
                    <div>{survivor?.tickerNo}</div>
                    <div>{survivor?.boardLot}</div>
                    <div>{survivor?.ISIN}</div>
                    <div>{survivor?.category}</div>
                    <div>{survivor?.subcategory}</div>
                    <div>{survivor?.currency}</div>
                    <div>{survivor?.createdDatetime?.toString()}</div>
                    <div>{survivor?.lastModifiedDatetime?.toString()}</div>
                </MultistepForm.Stage>
                <MultistepForm.Complete>Merge Complete!</MultistepForm.Complete>
                <MultistepForm.Controls />
            </MultistepForm>
        </Container>
    )
}

export default StockMergePage;