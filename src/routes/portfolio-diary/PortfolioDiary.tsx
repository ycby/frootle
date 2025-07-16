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

type StockData = SectionContainerItem & {}
type TransactionDataListItem = ListItem & TransactionData
type DiaryEntryListItem = ListItem & {
    content: string
}

const exampleStocks: StockData[] = [
    {
        name: 'Stock 1',
        id: 1
    },
    {
        name: 'Stock 2',
        id: 2
    },
    {
        name: 'Stock 3',
        id: 3
    }
]

const exampleTransactions: TransactionDataListItem[] = [
    {
        id: '00001',
        amount: 100,
        type: 'Buy',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 1, 1)
    },
    {
        id: '00002',
        amount: 200,
        type: 'Dividend',
        amountPerShare: 1,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 4, 13)
    },
    {
        id: '00003',
        amount: 300,
        type: 'Sell',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 6, 21)
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
    const [transactionData, setTransactionData] = useState<TransactionData[]>(exampleTransactions);
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

    const [currentStock, setCurrentStock] = useState<number>(0);

    useEffect(() => {

        //TODO: fetch transaction data for selected stock data
        //skip while making templates
        const getTransactions = async () => {

            const transactionsResponse = await fetch('http://localhost:3000/transaction', {
                method: 'GET'
            });

            //do the error handling later
            if (transactionsResponse.ok) {

                const transactionJson = await transactionsResponse.json();
                //TODO: make a mapping function for backend objects to front end
                const transactionData = transactionJson.data.map((data: TransactionDataBE) => convertBEtoFE(data));

                setTransactionData(transactionData);
            }
        }

        getTransactions()

    }, [stockData]);

    return (
        <div id="portfolio-diary">
            <h1>Portfolio Diary</h1>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '0 0 80px'
            }}>
                <SectionContainer
                    items={stockData}
                    onClick={(selected: number) => {
                        setCurrentStock(selected);
                    }}
                    selected={currentStock}
                >
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%'}}>
                        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%'}}>
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
                                itemRenderer={(item: TransactionData) => <TransactionComponent item={item} />}
                                newItemRenderer={NewTransactionComponent({sourceObject:tdBaseFields, updateSource:setTDBaseFields})}
                                filterRenderer={<div>Test Filter</div>}
                                onNew={async () => {

                                    //validate input and generate correct values

                                    //generate the value
                                    const td = convertFEtoBE(tdBaseFields);

                                    //send to back end
                                    const newTransactionResponse = await fetch('http://localhost:3000/transaction', {
                                        method: 'POST',
                                        body: JSON.stringify([td]),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    });

                                    if (!newTransactionResponse.ok) {

                                        console.error('Failed to create transaction');
                                    }

                                    //parse response and append to list
                                    let newArray: TransactionData[] = [...transactionData];
                                    newArray.unshift(convertBEtoFE(td));
                                    setTransactionData(newArray);
                                }}
                            >
                            </ListContainer>
                        </div>
                    </div>
                </SectionContainer>
            </div>
        </div>
    );
}

export {
    PortfolioDiary
}