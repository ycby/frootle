import './PortfolioDiary.css';
import SectionContainer, {SectionContainerItems} from "#root/src/helpers/section-container/SectionContainer.tsx";
import ListContainer, {ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import TransactionComponent, {TransactionData} from "#root/src/routes/portfolio-diary/transaction-component/TransactionComponent.tsx";
import {useEffect, useState} from "react";
import NewTransactionComponent, {
    NewTransactionInputs
} from "#root/src/routes/portfolio-diary/new-transaction-component/NewTransactionComponent.tsx";
import Button from "#root/src/helpers/button/Button.tsx";
import {MdAdd} from "react-icons/md";

type StockData = SectionContainerItems & {}
type TransactionDataListItem = ListItem & TransactionData

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

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockData[]>(exampleStocks);
    const [transactionData, setTransactionData] = useState<TransactionData[]>(exampleTransactions);
    const [tdBaseFields, setTDBaseFields] = useState<any>({});

    const [isOverlayOpened, setIsOverlayOpened] = useState<boolean>(false);

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
                    <ListContainer>
                        <ListContainer.Header>
                            <h3>Transactions</h3>
                            <Button
                                onClick={() => {
                                    setIsOverlayOpened(true);
                                }}
                            >
                                <MdAdd size='24px' />
                            </Button>
                        </ListContainer.Header>
                        <ListContainer.Body
                            items={transactionData}
                            itemRenderer={(item: TransactionData) => <TransactionComponent item={item} />}
                            isOverlayOpened={isOverlayOpened}
                        >
                            <form>
                                <NewTransactionComponent sourceObject={tdBaseFields} updateSource={setTDBaseFields} />
                                <div className='list-container__footer'>
                                    <Button onClick={() => {
                                        setIsOverlayOpened(false);
                                    }}>
                                        Back
                                    </Button>
                                    <Button onClick={() => {

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
                                        setIsOverlayOpened(false);
                                    }}>
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </ListContainer.Body>
                    </ListContainer>
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