import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItems} from "#root/src/helpers/section-container/SectionContainer.tsx";
import ListContainer from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent, {TransactionData} from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {useEffect, useState} from "react";
import NewTransactionComponent
    from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";

type StockData = SectionContainerItems & {}

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

const exampleTransactions: TransactionData[] = [
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

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockData[]>(exampleStocks);
    const [transactionData, setTransactionData] = useState<TransactionData[]>(exampleTransactions);

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
                >
                    <ListContainer
                        name='Transactions'
                        items={transactionData}
                        itemRenderer={(item: TransactionData) => <TransactionComponent item={item} />}
                        onAdd={(item: TransactionData) => {

                            //temp because should send to back end and only add on receive success message
                            let newArray = [...transactionData];
                            newArray.push(item);
                            setTransactionData(newArray);
                        }}
                        onAddRenderer={NewTransactionComponent}
                    />
                </SectionContainer>
            </div>
        </div>
    );
}

export {
    PortfolioDiary
}