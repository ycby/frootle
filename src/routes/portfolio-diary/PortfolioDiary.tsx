import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListContainer, ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {
    convertBEtoFETransaction,
    convertFEtoBETransaction,
    convertFEtoBEDiaryEntry,
    convertBEtoFEDiaryEntry
} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {
    NewTransactionInputs,
    TransactionData,
    TransactionDataBE,
    DiaryEntryData,
    StockData, DiaryEntryBE
} from "#root/src/routes/portfolio-diary/types.ts";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import {APIStatus, ComponentStatus, ComponentStatusKeys, APIResponse} from "#root/src/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as StockTransactionAPI from '#root/src/apis/StockTransactionAPI.ts';
import DiaryEntry from "#root/src/routes/portfolio-diary/diary-entry/DiaryEntry.tsx";
import NewDiaryEntry from "#root/src/routes/portfolio-diary/new-diary-entry/NewDiaryEntry.tsx";
import * as DiaryEntryAPI from "#root/src/apis/DiaryEntryAPI.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import Modal from "#root/src/helpers/modal/Modal.tsx";
import {FilterableSelect} from "#root/src/helpers/filterable-select/FilterableSelect.tsx";
import * as Stock from "#root/src/apis/StockAPI.ts";
import {FilterableSelectData} from "#root/src/helpers/filterable-select/FilterableSelectItem.tsx";
import Button from "#root/src/helpers/button/Button.tsx";

type StockDataContainerItem = SectionContainerItem & StockData;
export type DiaryEntryListItem = ListItem & DiaryEntryData & {
    editObject: DiaryEntryData;
};

export type TransactionDataListItem = ListItem & TransactionData & {
    editObject: NewTransactionInputs;
};

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

const exampleTransactions: TransactionData[] = [
    {
        id: 1,
        stockId: 1,
        amount: 100,
        type: 'buy',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 1, 1),
        currency: 'HKD',
    },
    {
        id: 2,
        stockId: 1,
        amount: 200,
        type: 'scrip_dividend',
        amountPerShare: 1,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 4, 13),
        currency: "HKD",
    },
    {
        id: 3,
        stockId: 1,
        amount: 300,
        type: 'sell',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 6, 21),
        currency: 'HKD',
    }
]

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
]

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockDataContainerItem[]>(exampleStocks);
    const [transactionData, setTransactionData] = useState<TransactionDataListItem[]>(() => processTransactionData(exampleTransactions));
    const [newTransactionData, setNewTransactionData] = useState<NewTransactionInputs>(resetNewTransactionData());

    const [diaryEntries, setDiaryEntries] = useState<DiaryEntryListItem[]>(() => processDiaryEntries(exampleDiaryEntry));
    const [newDiaryEntry, setNewDiaryEntry] = useState<DiaryEntryData>(resetDiaryEntryData());

    const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);

    const [newTrackedStock, setNewTrackedStock] = useState<FilterableSelectData>();
    //use ref for performance
    const untrackStockRef: MutableRefObject<number> = useRef(-1);
    const [hasNewTrackedStockCreated, setHasNewTrackedStockCreated] = useState<number>(0);

    const [isOpenNewTrackedStock, setIsOpenNewTrackedStock] = useState<boolean>(false);
    const [isOpenUntrackStock, setIsOpenUntrackStock] = useState<boolean>(false);

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

            let newCurrentStockIndex: number = 0;
            if (newTrackedStock) {
                newCurrentStockIndex = processedData.findIndex((element) => element.id === Number(newTrackedStock.value));
            }

            setStockData(processedData);
            setCurrentStockIndex(newCurrentStockIndex);
        }

        getTrackedStocks();
    }, [hasNewTrackedStockCreated]);

    useEffect(() => {

        //TODO: fetch transaction data for selected stock data
        //skip while making templates
        const getTransactions = async () => {

            const response: APIResponse<TransactionDataBE[]> = await StockTransactionAPI.getStockTransactions(stockData[currentStockIndex].id);

            //TODO: make a mapping function for backend objects to front end
            if (response.status === APIStatus.SUCCESS) {

                const transactionData: TransactionData[] = response.data.map((data: TransactionDataBE): TransactionData => convertBEtoFETransaction(data));

                const transactionDataLineItems: TransactionDataListItem[] = processTransactionData(transactionData);
                setTransactionData(transactionDataLineItems);
            }//Handle if failed to retrieve
        }

        if (stockData && stockData[currentStockIndex] && currentStockIndex >= 0 && currentStockIndex < stockData.length) {

            getTransactions();
            setNewTransactionData({...resetNewTransactionData(), stockId: stockData[currentStockIndex].id});
            setNewDiaryEntry({...resetDiaryEntryData(), stockId: stockData[currentStockIndex].id});
        }
    }, [currentStockIndex, stockData]);

    useEffect(() => {

        const getDiaryEntries = async () => {

            const response: APIResponse<DiaryEntryBE[]> = await DiaryEntryAPI.getDiaryEntries(stockData[currentStockIndex].id);

            if (response.status === APIStatus.SUCCESS) {

                const diaryEntryData: DiaryEntryData[] = response.data.map((data: DiaryEntryBE): DiaryEntryData => convertBEtoFEDiaryEntry(data));

                const diaryEntryLineItems: DiaryEntryListItem[] = processDiaryEntries(diaryEntryData);
                setDiaryEntries(diaryEntryLineItems);
            }//Handle if failed to retrieve
        }

        if (stockData && stockData[currentStockIndex]) {

            getDiaryEntries();
        }
    }, [currentStockIndex, stockData]);

    //TODO: split into 2 col
    //Left: Thesis and Diary Entries
    //Right: Transactions and totals
    return (
        <div id="portfolio-diary">
            <h1>Portfolio Diary</h1>
            <SectionContainer
                className='portfolio-diary__container'
                items={stockData}
                onClick={(selected: number) => {
                    setCurrentStockIndex(selected);
                }}
                onNew={() => {
                    setIsOpenNewTrackedStock(true);
                }}
                selected={currentStockIndex}
                onDelete={(selected: number) => {

                    untrackStockRef.current = selected;
                    setIsOpenUntrackStock(true);
                }}
            >
                <div className='portfolio-diary__main'>
                    <div className='portfolio-diary__content'>
                        <div className='thesis'>
                            Thesis
                        </div>
                        <div className='diary-list'>
                            <ListContainer
                                name='Diary Entries'
                                items={diaryEntries}
                                itemRenderer={(diaryEntry: DiaryEntryListItem) =>
                                    <DiaryEntry
                                        entry={diaryEntry}
                                        editView={
                                            <NewDiaryEntry
                                                sourceObject={diaryEntry.editObject}
                                                updateSource={(obj: DiaryEntryData) => {

                                                    let newDiaryEntries: DiaryEntryListItem[] = [...diaryEntries];

                                                    newDiaryEntries[diaryEntry.index].editObject = obj;

                                                    setDiaryEntries(newDiaryEntries);
                                                }
                                            }
                                            />}
                                        onEdit={ async (index: number) => {

                                            let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];

                                            const updatedDiaryEntryEditObject: DiaryEntryData = newDiaryEntryListItems[index].editObject;
                                            const diaryEntryBE: DiaryEntryBE = convertFEtoBEDiaryEntry(updatedDiaryEntryEditObject);

                                            if (newDiaryEntryListItems[index].id === undefined) return;

                                            if ((await DiaryEntryAPI.putDiaryEntry(newDiaryEntryListItems[index].id, diaryEntryBE)).status === APIStatus.FAIL) {

                                                console.error('Failed to update transaction');
                                                return;
                                            }

                                            //if success, update the front end
                                            newDiaryEntryListItems[index] = replaceDiaryEntryData(newDiaryEntryListItems[index], convertBEtoFEDiaryEntry(diaryEntryBE));

                                            setDiaryEntries(processDiaryEntries(newDiaryEntryListItems));
                                        }}
                                        onDelete={ async (index: number) => {

                                            let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];

                                            //perform the api call
                                            const diaryEntryToDelete: DiaryEntryListItem = diaryEntries[index];

                                            if (diaryEntryToDelete.id === undefined) return;

                                            const response: APIResponse<any[]> = await DiaryEntryAPI.deleteDiaryEntry(diaryEntryToDelete.id);

                                            if (response.status === APIStatus.FAIL) {

                                                console.error('Failed to delete transaction');
                                            } else {

                                                //on successful delete, remove from frontend list
                                                newDiaryEntryListItems.splice(index, 1);

                                                setDiaryEntries(newDiaryEntryListItems);
                                            }
                                        }}
                                        onBack={(index: number) => {
                                            let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
                                            newDiaryEntryListItems[index].status = ComponentStatus.VIEW;
                                            setDiaryEntries(newDiaryEntryListItems);
                                        }}
                                    />
                                }
                                newItemRenderer={<NewDiaryEntry sourceObject={newDiaryEntry} updateSource={setNewDiaryEntry} />}
                                onNew={async () => {

                                    const processedNewDiaryEntry = convertFEtoBEDiaryEntry(newDiaryEntry);

                                    const response = await DiaryEntryAPI.postDiaryEntries(processedNewDiaryEntry);
                                    if (response.status === APIStatus.FAIL) {
                                        //Handle Failure
                                        console.error('Failed to create new Diary Entry');
                                        return;
                                    }

                                    newDiaryEntry.id = response.data[0];
                                    const processedDiaryEntry = processDiaryEntries([newDiaryEntry]);

                                    let newDiaryEntries = [...diaryEntries];
                                    newDiaryEntries.unshift(processedDiaryEntry[0]);

                                    setDiaryEntries(newDiaryEntries);
                                    setNewDiaryEntry({...resetDiaryEntryData(), stockId: stockData[currentStockIndex].id});
                                }}
                                onEdit={(index: number) => {
                                    let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
                                    newDiaryEntryListItems[index].status = ComponentStatus.EDIT;
                                    setDiaryEntries(newDiaryEntryListItems);
                                }}
                                onDelete={(index: number) => {
                                    let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
                                    newDiaryEntryListItems[index].status = ComponentStatus.DELETE;
                                    setDiaryEntries(newDiaryEntryListItems);
                                }}
                            />
                        </div>
                    </div>
                    <div style={{margin: '20px'}}>
                        <ListContainer
                            name='Transactions'
                            items={transactionData}
                            itemRenderer={(item: TransactionDataListItem) => {

                                return (
                                    <TransactionComponent
                                        item={item}
                                        editView={
                                        <NewTransactionComponent
                                            sourceObject={item.editObject}
                                            updateSource={(obj) => {

                                                    let newTransactionListItems = [...transactionData];

                                                    newTransactionListItems[item.index].editObject = obj;

                                                    setTransactionData(newTransactionListItems);
                                                }
                                            }
                                        />
                                        }
                                        onEdit={async (index: number) => {
                                            console.log('onEdit')

                                            let newTransactionListItems = [...transactionData];

                                            const updatedTransactionEditObject = newTransactionListItems[index].editObject;
                                            const transactionToBE = convertFEtoBETransaction(updatedTransactionEditObject);

                                            if (transactionData[index].id === undefined) {
                                                console.error('Missing Id!')
                                                return;
                                            }

                                            if ((await StockTransactionAPI.putStockTransaction(transactionData[index].id, transactionToBE)).status === APIStatus.FAIL) {

                                                console.error('Failed to update transaction');
                                                return;
                                            }

                                            //if success, update the front end
                                            newTransactionListItems[index] = replaceTransactionData(newTransactionListItems[index], convertBEtoFETransaction(transactionToBE));

                                            setTransactionData(processTransactionData(newTransactionListItems))
                                        }}
                                        onDelete={async (index) => {
                                            console.log('onDelete');
                                            let newTransactionListItems = [...transactionData];

                                            //perform the api call
                                            const transactionToDelete = transactionData[index];

                                            if (transactionToDelete.id === undefined) return;

                                            const response = await StockTransactionAPI.deleteStockTransaction(transactionToDelete.id);
                                            if (response.status === APIStatus.FAIL) {

                                                console.error('Failed to delete transaction');
                                            } else {

                                                //on successful delete, remove from frontend list
                                                newTransactionListItems.splice(index, 1);

                                                setTransactionData(newTransactionListItems);
                                            }
                                        }}
                                        onBack={(index) => {
                                            let newTransactionListItems = [...transactionData];
                                            newTransactionListItems[index].status = ComponentStatus.VIEW;
                                            setTransactionData(newTransactionListItems);
                                        }}
                                    />
                                )
                            }}
                            newItemRenderer={
                                <NewTransactionComponent sourceObject={newTransactionData} updateSource={setNewTransactionData} />
                            }
                            onNew={async () => {

                                //validate input and generate correct values

                                //generate the value
                                const td = convertFEtoBETransaction(newTransactionData);

                                //send to back end
                                const response = await StockTransactionAPI.postStockTransactions(td);
                                if (response.status === APIStatus.FAIL) {
                                    console.error('Failed to create transaction');
                                    return;
                                }

                                //set the id of the transaction - assume only 1
                                td.id = response.data[0];
                                //parse response and append to list
                                let newArray: TransactionData[] = [...transactionData];
                                newArray.unshift(convertBEtoFETransaction(td));
                                setTransactionData(processTransactionData(newArray));
                                setNewTransactionData({...resetNewTransactionData(), stockId: stockData[currentStockIndex].id});
                            }}
                            onEdit={(index: number) => {
                                console.log('onEdit icon');
                                let newTransactionListItems = [...transactionData];
                                newTransactionListItems[index].status = ComponentStatus.EDIT;
                                setTransactionData(newTransactionListItems);
                            }}
                            onDelete={(index: number) => {
                                console.log('onDelete icon');
                                let newTransactionListItems = [...transactionData];
                                newTransactionListItems[index].status = ComponentStatus.DELETE;
                                setTransactionData(newTransactionListItems);
                            }}
                        >
                        </ListContainer>
                    </div>
                </div>
            </SectionContainer>
            <Modal
                isOpen={isOpenNewTrackedStock}
                setIsOpen={setIsOpenNewTrackedStock}
            >
                <h3>Track New Stock</h3>
                <FilterableSelect
                    queryFn={async (args: string) => {

                        const response: APIResponse<StockData[]> = await Stock.getStocksByNameOrTicker(args);
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
                <div>Name: {newTrackedStock?.label}</div>
                <div>Ticker: {newTrackedStock?.subtext}</div>
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
                        setIsOpenNewTrackedStock(false);
                    }
                }}>Save</Button>
            </Modal>
            <Modal
                isOpen={isOpenUntrackStock}
                setIsOpen={setIsOpenUntrackStock}
            >
                <h3>Untrack Stock: {untrackStockRef.current >= 0 ? stockData[untrackStockRef.current].ticker_no : ''}</h3>
                <p>Are you sure?</p>
                <Button onClick={async () => {

                    //should never happen? no need failsafe?
                    if (!stockData[untrackStockRef.current]) return;
                    if (!stockData[untrackStockRef.current].id) return;

                    const result = await StockAPI.setUntrackedStock(Number(stockData[untrackStockRef.current].id));

                    if (result.status === APIStatus.FAIL) {
                        //TODO: handle fail case
                    }

                    if (result.status === APIStatus.SUCCESS) {
                        untrackStockRef.current = -1;
                        setIsOpenUntrackStock(false);
                        setHasNewTrackedStockCreated(prevState => prevState + 1);
                    }
                }}>Delete</Button>
            </Modal>
        </div>
    );
}

const processTransactionData: (transactionData: TransactionData[]) => TransactionDataListItem[] = (transactionData: TransactionData[]): TransactionDataListItem[] => {

    return transactionData.map((element: TransactionData, index: number): TransactionDataListItem => {
        return ({
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys,
            editObject: {
                stockId: element.stockId,
                type: element.type,
                amtWFee: (Number(element.amount ?? 0) + Number(element.fee ?? 0)).toFixed(2),
                amtWOFee: (element.amount ?? 0).toString(),
                quantity: (element.quantity ?? 0).toString(),
                transactionDate: dateToStringConverter(element.transactionDate),
                currency: element.currency
            }
        }) as TransactionDataListItem;
    });
}

const processDiaryEntries: (diaryEntries: DiaryEntryData[]) => DiaryEntryListItem[] = (diaryEntries: DiaryEntryData[]): DiaryEntryListItem[] => {

    return diaryEntries.map((element: DiaryEntryData, index: number) => {

        return {
            ...element,
            index: index,
            status: ComponentStatus.VIEW as ComponentStatusKeys,
            editObject: {
                id: element.id,
                stockId: element.stockId,
                title: element.title,
                content: element.content,
                postedDate: element.postedDate,
            }
        }
    });
}

const replaceTransactionData: (original: TransactionDataListItem, transactionData: TransactionData) => TransactionDataListItem = (original: TransactionDataListItem, transactionData: TransactionData): TransactionDataListItem => {

    return ({
        ...transactionData,
        index: original.index,
        status: original.status,
        id: original.id,
        editObject: {
            stockId: transactionData.stockId,
            type: transactionData.type,
            amtWFee: (transactionData.amount + transactionData.fee).toString(),
            amtWOFee: (transactionData.amount).toString(),
            quantity: (transactionData.quantity).toString(),
            transactionDate: dateToStringConverter(transactionData.transactionDate),
            currency: transactionData.currency
        }
    } as TransactionDataListItem);
}

const replaceDiaryEntryData: (original: DiaryEntryListItem, diaryEntryData: DiaryEntryData) => DiaryEntryListItem = (original: DiaryEntryListItem, diaryEntryData: DiaryEntryData): DiaryEntryListItem => {

    return ({
        ...diaryEntryData,
        index: original.index,
        status: original.status,
        id: original.id,
        editObject: {
            stockId: diaryEntryData.stockId,
            title: diaryEntryData.title,
            content: diaryEntryData.content,
            postedDate: diaryEntryData.postedDate,
        }
    } as DiaryEntryListItem);
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

const resetDiaryEntryData: () => DiaryEntryData = (): DiaryEntryData => {

    return {
        stockId: 0,
        title: '',
        content: '',
        postedDate: new Date(),
    }
}

export {
    PortfolioDiary
}