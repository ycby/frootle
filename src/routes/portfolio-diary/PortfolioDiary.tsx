import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListContainer, ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent, {TransactionData} from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {useEffect, useState} from "react";
import NewTransactionComponent, {
    NewTransactionInputs
} from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import Button from "#root/src/helpers/button/Button.tsx";

type StockData = SectionContainerItem & {}
type TransactionDataListItem = ListItem & TransactionData
type DiaryEntryListItem = ListItem & {
    entry: string
}

const exampleStocks: StockData[] = [
    {
        name: 'Stock 1',
        id: '00001'
    },
    {
        name: 'Stock 2',
        id: '00002'
    },
    {
        name: 'Stock 3',
        id: '00003'
    }
]

const exampleTransactions: TransactionDataListItem[] = [
    {
        id: '00001',
        type: 'Buy',
        amountPerShare: 10,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 1, 1)
    },
    {
        id: '00002',
        type: 'Dividend',
        amountPerShare: 1,
        quantity: 5,
        fee: 0.1,
        transactionDate: new Date(2025, 4, 13)
    },
    {
        id: '00003',
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
        entry: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. '
    },
    {
        id: '00002',
        entry: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus libero vitae tristique ultrices. Phasellus tempus condimentum mauris vel convallis. Integer pellentesque erat ut rutrum hendrerit. Pellentesque eros ligula, egestas eu posuere ac, feugiat in massa. Nulla suscipit velit sed ex sollicitudin eleifend id ac lacus. Pellentesque eu lacus ut massa volutpat posuere non ac nisi. Praesent ullamcorper sit amet quam laoreet pharetra. Nunc elementum tincidunt efficitur. Cras ut lacinia quam. Nunc interdum iaculis lacus in mollis. Duis sit amet est vel felis faucibus ultrices non quis metus. '
    }
]

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockData[]>(exampleStocks);
    const [transactionData, setTransactionData] = useState<TransactionData[]>(exampleTransactions);
    const [tdBaseFields, setTDBaseFields] = useState<any>({});
    const [diaryEntries, setDiaryEntries] = useState<any>(exampleDiaryEntry);

    const [currentStock, setCurrentStock] = useState<number>(0);

    useEffect(() => {

        //TODO: fetch transaction data for selected stock data
        //skip while making templates

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
                                    <Button style={{fontSize: '0.75em'}}>
                                        New
                                    </Button>
                                </div>
                                <div style={{margin: '12px 0'}}>
                                    {diaryEntries.map((entry: DiaryEntryListItem, index: number) => {

                                        return (
                                            <div key={entry.id} style={{
                                                border: 'solid 1px black',
                                                height: '150px',
                                                padding: '8px'
                                            }}>
                                                <h3 style={{margin: '0'}}>#{index + 1}</h3>
                                                <div style={{
                                                    fontSize: '0.75em',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    height: '5lh',
                                                    margin: '12px',
                                                }}>
                                                    {entry.entry}
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
                                onNew={() => {

                                    //validate input and generate correct values

                                    //generate the value
                                    const td = inputToNewTransactionConverter(tdBaseFields);

                                    //send to back end
                                    //TODO: just mock first
                                    const response = {...td, id: '00005'}

                                    //parse response and append to list
                                    let newArray: TransactionData[] = [...transactionData];
                                    newArray.unshift(response);
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

const inputToNewTransactionConverter:(sourceObj: NewTransactionInputs) => TransactionData = (sourceObj: NewTransactionInputs) => {

    const type = sourceObj.type;
    const amountPerShare = Number(sourceObj.amtWOFee) / Number(sourceObj.quantity);
    const quantity = Number(sourceObj.quantity);
    const fee = Number(sourceObj.amtWFee) - Number(sourceObj.amtWOFee);

    return {
        type: type,
        amountPerShare: amountPerShare,
        quantity: quantity,
        fee: fee,
        transactionDate: new Date()
    };
}

export {
    PortfolioDiary
}