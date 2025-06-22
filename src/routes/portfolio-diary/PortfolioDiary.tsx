import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItems} from "#root/src/helpers/section-container/SectionContainer.tsx";
import ListContainer, {ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";

type StockData = SectionContainerItems & {

}

type TransactionData = ListItem & {
    type: string;
    amountPerShare: number;
    quantity: number;
    fee: number;
    transactionDate: Date;
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

    return (
        <div id="portfolio-diary">
            <h1>Portfolio Diary</h1>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '0 0 80px'
            }}>
                <SectionContainer
                    items={exampleStocks}
                >
                    <ListContainer
                        name='Transactions'
                        items={exampleTransactions}
                        itemRenderer={(item: TransactionData) => {
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <div
                                        className='classification-strip'
                                        style={{
                                            backgroundColor: item.type === 'Buy' ? "green" : item.type === 'Sell' ? "red" : "yellow"
                                        }}
                                    ></div>
                                    <div className='data-container'>
                                        <div>
                                            {dateToStringConverter(item.transactionDate)}
                                        </div>
                                        <div>
                                            {item.quantity} @ ${item.amountPerShare} - ${item.fee}<br/>
                                            ${item.amountPerShare * item.quantity - item.fee}
                                        </div>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </SectionContainer>
            </div>
        </div>
    );
}
//TODO: split off the itemrenderer into its own component
//Problem is cannot control alignment
//{item.quantity} @ ${item.amountPerShare} - ${item.fee} = ${item.amountPerShare * item.quantity - item.fee}


export {
    PortfolioDiary
}