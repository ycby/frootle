import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListContainer, ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {useEffect, useState} from "react";
import {convertBEtoFETransaction, convertFEtoBETransaction, convertFEtoBEDiaryEntry} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {
    NewTransactionInputs,
    TransactionData,
    TransactionDataBE,
    DiaryEntryData,
    StockData
} from "#root/src/routes/portfolio-diary/types.ts";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import {APIStatus, ComponentStatus, ComponentStatusKeys, APIResponse} from "#root/src/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as StockTransactionAPI from '#root/src/apis/StockTransactionAPI.ts';
import DiaryEntry from "#root/src/routes/portfolio-diary/diary-entry/DiaryEntry.tsx";
import NewDiaryEntry from "#root/src/routes/portfolio-diary/new-diary-entry/NewDiaryEntry.tsx";
import * as DiaryEntryAPI from "#root/src/apis/DiaryEntryAPI.ts";

type StockDataContainerItem = SectionContainerItem & StockData;
export type DiaryEntryListItem = ListItem & DiaryEntryData;

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
        type: 'dividend',
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
    const [newTransactionData, setNewTransactionData] = useState<NewTransactionInputs>({
        stockId: 3007,
        type: 'buy',
        transactionDate: '',
        amtWOFee: '',
        amtWFee: '',
        quantity: '',
        currency: 'HKD'
    });
    const [diaryEntries, setDiaryEntries] = useState<DiaryEntryListItem[]>(() => processDiaryEntries(exampleDiaryEntry));
    const [newDiaryEntry, setNewDiaryEntry] = useState<DiaryEntryData>({
        stockId: 3007,
        title: '',
        content: '',
        postedDate: new Date(),
    });

    const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);

    useEffect(() => {

        const getStocksWithTransactions = async () => {

            const response: APIResponse<StockData[]> = await StockTransactionAPI.getStocksWithTransactions();

            if (response.status === APIStatus.FAIL) {

                console.error('No stocks with transactions found');
            }

            //do some processing for response

            const processedData:StockDataContainerItem[] = response.data.map((data: StockData): StockDataContainerItem => {
                return {...data, title: data.ticker_no}
            });

            setStockData(processedData);
            setCurrentStockIndex(0);
        }

        getStocksWithTransactions();
    }, []);

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

        if (currentStockIndex >= 0 && currentStockIndex < stockData.length) {

            getTransactions();
        }
    }, [currentStockIndex, stockData]);

    return (
        <div id="portfolio-diary">
            <h1>Portfolio Diary</h1>
            <SectionContainer
                className='portfolio-diary__container'
                items={stockData}
                onClick={(selected: number) => {
                    setCurrentStockIndex(selected);
                }}
                selected={currentStockIndex}
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
                                itemRenderer={(diaryEntry: DiaryEntryListItem) => <DiaryEntry entry={diaryEntry} />}
                                newItemRenderer={<NewDiaryEntry sourceObject={newDiaryEntry} updateSource={setNewDiaryEntry} />}
                                filterRenderer={<div>TestFilter</div>}
                                onNew={async () => {

                                    const processedNewDiaryEntry = convertFEtoBEDiaryEntry(newDiaryEntry);

                                    if ((await DiaryEntryAPI.postDiaryEntries(processedNewDiaryEntry)).status === APIStatus.FAIL) {
                                        //Handle Failure
                                        console.error('Failed to create new Diary Entry');
                                        return;
                                    }

                                    const processedDiaryEntry = processDiaryEntries([newDiaryEntry]);

                                    let newDiaryEntries = [...diaryEntries];
                                    newDiaryEntries.unshift(processedDiaryEntry[0]);

                                    setDiaryEntries(newDiaryEntries);
                                }}
                                onEdit={() => {}}
                                onDelete={() => {}}
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

                                            if (transactionData[index].id === undefined) return;

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
                            filterRenderer={<div>Test Filter</div>}
                            onNew={async () => {

                                //validate input and generate correct values

                                //generate the value
                                const td = convertFEtoBETransaction(newTransactionData);

                                //send to back end
                                if ((await StockTransactionAPI.postStockTransactions(td)).status === APIStatus.FAIL) {
                                    console.error('Failed to create transaction');
                                    return;
                                }

                                //parse response and append to list
                                let newArray: TransactionData[] = [...transactionData];
                                newArray.unshift(convertBEtoFETransaction(td));
                                setTransactionData(processTransactionData(newArray));
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
                amtWFee: (element.amount + element.fee).toString(),
                amtWOFee: (element.amount).toString(),
                quantity: (element.quantity).toString(),
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
        }
    });
}

const replaceTransactionData: (original: TransactionDataListItem, transactionData: TransactionData) => TransactionDataListItem = (original: TransactionDataListItem, transactionData: TransactionData): TransactionDataListItem => {

    return ({
        ...transactionData,
        index: original.index,
        status: original.status,
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

export {
    PortfolioDiary
}