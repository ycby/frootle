import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListContainer, ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {useEffect, useState} from "react";
import Button from "#root/src/helpers/button/Button.tsx";
import {convertBEtoFE, convertFEtoBE} from "#root/src/routes/portfolio-diary/PortfolioDiaryHelpers.ts";
import {NewTransactionInputs, TransactionData, TransactionDataBE} from "#root/src/routes/portfolio-diary/types.ts";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import {ComponentStatus, ComponentStatusKeys} from "#root/src/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as StockTransactionAPI from '#root/src/apis/StockTransactionAPI.ts';

type StockData = SectionContainerItem & {
    name: string;
    full_name?: string;
}
type DiaryEntryListItem = ListItem & {
    content: string
}
export type TransactionDataListItem = ListItem & TransactionData & {
    editObject: NewTransactionInputs;
};

const exampleStocks: StockData[] = [
    {
        id: 1,
        ticker_no: '00001',
        name: 'Stock 1'
    },
    {
        id: 2,
        ticker_no: '00002',
        name: 'Stock 2',
    },
    {
        id: 3,
        ticker_no: '00003',
        name: 'Stock 3',
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

const exampleDiaryEntry: DiaryEntryListItem[] = [
    {
        id: '00001',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. '
    },
    {
        id: '00002',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. '
    },
    {
        id: '00003',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. '
    }
]

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockData[]>(exampleStocks);
    const [transactionData, setTransactionData] = useState<TransactionDataListItem[]>(() => processTransactionData(exampleTransactions));
    const [tdBaseFields, setTDBaseFields] = useState<NewTransactionInputs>({
        stockId: 3007,
        type: 'buy',
        transactionDate: '',
        amtWOFee: '',
        amtWFee: '',
        quantity: '',
        currency: 'HKD'
    });
    const [diaryEntries, setDiaryEntries] = useState<any>(exampleDiaryEntry);

    const [currentStockIndex, setCurrentStockIndex] = useState<number>(0);

    useEffect(() => {

        const getStocksWithTransactions = async () => {

            const data = await StockTransactionAPI.getStocksWithTransactions();

            if (data.length === 0) {

                console.error('No stocks with transactions found');
            }

            setStockData(data);
            setCurrentStockIndex(0);
        }

        getStocksWithTransactions();
    }, []);

    useEffect(() => {

        //TODO: fetch transaction data for selected stock data
        //skip while making templates
        const getTransactions = async () => {

            const response = await StockTransactionAPI.getStockTransactions(stockData[currentStockIndex].id);

            //TODO: make a mapping function for backend objects to front end
            const transactionData = response.map((data: TransactionDataBE) => convertBEtoFE(data));

            const transactionDataLineItems = processTransactionData(transactionData);
            setTransactionData(transactionDataLineItems);
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
                            <div style={{alignSelf: 'end'}}>
                                <Button
                                    style={{fontSize: '0.75em'}}
                                    onClick={() => {

                                    }}
                                >
                                    New
                                </Button>
                            </div>
                            <div style={{margin: '12px 0', overflow: "scroll"}}>
                                {diaryEntries.map((entry: DiaryEntryListItem, index: number) => {

                                    return (
                                        <div key={entry.id} style={{
                                            border: 'solid 1px black',
                                            height: '150px',
                                            padding: '8px',
                                            margin: '8px 0'
                                        }}>
                                            <h3 style={{margin: '0'}}>#{index + 1}</h3>
                                            <div style={{
                                                fontSize: '0.75em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                height: '5lh',
                                                margin: '12px',
                                            }}>
                                                {entry.content}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
                                            const transactionToBE = convertFEtoBE(updatedTransactionEditObject);

                                            if (!(await StockTransactionAPI.putStockTransaction(transactionData[index].id, transactionToBE))) {

                                                console.error('Failed to update transaction');
                                                return;
                                            }

                                            //if success, update the front end
                                            newTransactionListItems[index] = replaceTransactionData(newTransactionListItems[index], convertBEtoFE(transactionToBE));

                                            setTransactionData(processTransactionData(newTransactionListItems))
                                        }}
                                        onDelete={async (index) => {
                                            console.log('onDelete');
                                            let newTransactionListItems = [...transactionData];

                                            //perform the api call
                                            const transactionToDelete = transactionData[index];

                                            const completed = await StockTransactionAPI.deleteStockTransaction(transactionToDelete.id);
                                            if (!completed) {

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
                                <NewTransactionComponent sourceObject={tdBaseFields} updateSource={setTDBaseFields} />
                            }
                            filterRenderer={<div>Test Filter</div>}
                            onNew={async () => {

                                //validate input and generate correct values

                                //generate the value
                                const td = convertFEtoBE(tdBaseFields);

                                //send to back end
                                if (!(await StockTransactionAPI.postStockTransactions(td))) {
                                    console.error('Failed to create transaction');
                                    return;
                                }

                                //parse response and append to list
                                let newArray: TransactionData[] = [...transactionData];
                                newArray.unshift(convertBEtoFE(td));
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