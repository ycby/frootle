import './PortfolioDiary.css';
import {SectionContainerItem} from "#root/src/helpers/section-container/SectionContainer.tsx";
import {ListItem} from "#root/src/helpers/list-container/ListContainer.tsx";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {
    NewTransactionInputs,
    TransactionData,
    DiaryEntryData,
    StockData
} from "#root/src/routes/portfolio-diary/types.ts";

import {APIStatus, ComponentStatus, ComponentStatusKeys, APIResponse} from "#root/src/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import {Form, Stack} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

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

const PortfolioDiary = () => {

    const [stockData, setStockData] = useState<StockDataContainerItem[]>(exampleStocks);

    const [searchTerm, setSearchTerm] = useState('');

    //use ref for performance
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

            setStockData(processedData);
        }

        getTrackedStocks();
    }, [hasNewTrackedStockCreated]);

    let navigate = useNavigate();

    //TODO: split into 2 col
    //Left: Thesis and Diary Entries
    //Right: Transactions and totals
    return (
        <Container fluid>
            <Form>
                <Form.Control
                    type='text'
                    placeholder='Filter tracked stocks...'
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </Form>
            <Stack
                direction='horizontal'
                gap={3}
                className='mt-4 mb-4'
                style={{ width: '100%', flexWrap: 'wrap', justifyContent: 'start'}}>
                {
                    stockData.filter(element => {

                        if (!searchTerm) return true;

                        return element.ticker_no.includes(searchTerm);
                    }).map(element => {

                        return (
                            <Card
                                key={element.id} style={{width: '30%', height: '9rem'}}
                                onClick={() => navigate(`/portfolio/${element.ticker_no}`)}
                                className='stock-card'
                            >
                                <Card.Body>
                                    <Card.Title>{element.ticker_no}-{element.name}</Card.Title>
                                    <Card.Text>Example Text</Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })
                }
            </Stack>
        </Container>
        // <div id="portfolio-diary">
        //     <h1>Portfolio Diary</h1>
        //     <SectionContainer
        //         className='portfolio-diary__container'
        //         items={stockData}
        //         onClick={(selected: number) => {
        //             setCurrentStockIndex(selected);
        //         }}
        //         onNew={() => {
        //             setIsOpenNewTrackedStock(true);
        //         }}
        //         selected={currentStockIndex}
        //         onDelete={(selected: number) => {
        //
        //             untrackStockRef.current = selected;
        //             setIsOpenUntrackStock(true);
        //         }}
        //     >
        //         <div className='portfolio-diary__main'>
        //             <div className='portfolio-diary__content'>
        //                 <div className='thesis'>
        //                     Thesis
        //                 </div>
        //                 <div className='diary-list'>
        //                     <ListContainer
        //                         name='Diary Entries'
        //                         items={diaryEntries}
        //                         itemRenderer={(diaryEntry: DiaryEntryListItem) =>
        //                             <DiaryEntry
        //                                 entry={diaryEntry}
        //                                 editView={
        //                                     <NewDiaryEntry
        //                                         sourceObject={diaryEntry.editObject}
        //                                         updateSource={(obj: DiaryEntryData) => {
        //
        //                                             let newDiaryEntries: DiaryEntryListItem[] = [...diaryEntries];
        //
        //                                             newDiaryEntries[diaryEntry.index].editObject = obj;
        //
        //                                             setDiaryEntries(newDiaryEntries);
        //                                         }
        //                                     }
        //                                     />}
        //                                 onEdit={ async (index: number) => {
        //
        //                                     let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
        //
        //                                     const updatedDiaryEntryEditObject: DiaryEntryData = newDiaryEntryListItems[index].editObject;
        //                                     const diaryEntryBE: DiaryEntryBE = convertFEtoBEDiaryEntry(updatedDiaryEntryEditObject);
        //
        //                                     if (newDiaryEntryListItems[index].id === undefined) return;
        //
        //                                     if ((await DiaryEntryAPI.putDiaryEntry(newDiaryEntryListItems[index].id, diaryEntryBE)).status === APIStatus.FAIL) {
        //
        //                                         console.error('Failed to update transaction');
        //                                         return;
        //                                     }
        //
        //                                     //if success, update the front end
        //                                     newDiaryEntryListItems[index] = replaceDiaryEntryData(newDiaryEntryListItems[index], convertBEtoFEDiaryEntry(diaryEntryBE));
        //
        //                                     setDiaryEntries(processDiaryEntries(newDiaryEntryListItems));
        //                                 }}
        //                                 onDelete={ async (index: number) => {
        //
        //                                     let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
        //
        //                                     //perform the api call
        //                                     const diaryEntryToDelete: DiaryEntryListItem = diaryEntries[index];
        //
        //                                     if (diaryEntryToDelete.id === undefined) return;
        //
        //                                     const response: APIResponse<any[]> = await DiaryEntryAPI.deleteDiaryEntry(diaryEntryToDelete.id);
        //
        //                                     if (response.status === APIStatus.FAIL) {
        //
        //                                         console.error('Failed to delete transaction');
        //                                     } else {
        //
        //                                         //on successful delete, remove from frontend list
        //                                         newDiaryEntryListItems.splice(index, 1);
        //
        //                                         setDiaryEntries(newDiaryEntryListItems);
        //                                     }
        //                                 }}
        //                                 onBack={(index: number) => {
        //                                     let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
        //                                     newDiaryEntryListItems[index].status = ComponentStatus.VIEW;
        //                                     setDiaryEntries(newDiaryEntryListItems);
        //                                 }}
        //                             />
        //                         }
        //                         newItemRenderer={<NewDiaryEntry sourceObject={newDiaryEntry} updateSource={setNewDiaryEntry} />}
        //                         onNew={async () => {
        //
        //                             const processedNewDiaryEntry = convertFEtoBEDiaryEntry(newDiaryEntry);
        //
        //                             const response = await DiaryEntryAPI.postDiaryEntries(processedNewDiaryEntry);
        //                             if (response.status === APIStatus.FAIL) {
        //                                 //Handle Failure
        //                                 console.error('Failed to create new Diary Entry');
        //                                 return;
        //                             }
        //
        //                             newDiaryEntry.id = response.data[0];
        //                             const processedDiaryEntry = processDiaryEntries([newDiaryEntry]);
        //
        //                             let newDiaryEntries = [...diaryEntries];
        //                             newDiaryEntries.unshift(processedDiaryEntry[0]);
        //
        //                             setDiaryEntries(newDiaryEntries);
        //                             setNewDiaryEntry({...resetDiaryEntryData(), stockId: stockData[currentStockIndex].id});
        //                         }}
        //                         onEdit={(index: number) => {
        //                             let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
        //                             newDiaryEntryListItems[index].status = ComponentStatus.EDIT;
        //                             setDiaryEntries(newDiaryEntryListItems);
        //                         }}
        //                         onDelete={(index: number) => {
        //                             let newDiaryEntryListItems: DiaryEntryListItem[] = [...diaryEntries];
        //                             newDiaryEntryListItems[index].status = ComponentStatus.DELETE;
        //                             setDiaryEntries(newDiaryEntryListItems);
        //                         }}
        //                     />
        //                 </div>
        //             </div>
        //             <div style={{margin: '20px'}}>
        //                 <ListContainer
        //                     name='Transactions'
        //                     items={transactionData}
        //                     itemRenderer={(item: TransactionDataListItem) => {
        //
        //                         return (
        //                             <TransactionComponent
        //                                 item={item}
        //                                 editView={
        //                                 <NewTransactionComponent
        //                                     sourceObject={item.editObject}
        //                                     updateSource={(obj) => {
        //
        //                                             let newTransactionListItems = [...transactionData];
        //
        //                                             newTransactionListItems[item.index].editObject = obj;
        //
        //                                             setTransactionData(newTransactionListItems);
        //                                         }
        //                                     }
        //                                 />
        //                                 }
        //                                 onEdit={async (index: number) => {
        //                                     console.log('onEdit')
        //
        //                                     let newTransactionListItems = [...transactionData];
        //
        //                                     const updatedTransactionEditObject = newTransactionListItems[index].editObject;
        //                                     const transactionToBE = convertFEtoBETransaction(updatedTransactionEditObject);
        //
        //                                     if (transactionData[index].id === undefined) {
        //                                         console.error('Missing Id!')
        //                                         return;
        //                                     }
        //
        //                                     if ((await StockTransactionAPI.putStockTransaction(transactionData[index].id, transactionToBE)).status === APIStatus.FAIL) {
        //
        //                                         console.error('Failed to update transaction');
        //                                         return;
        //                                     }
        //
        //                                     //if success, update the front end
        //                                     newTransactionListItems[index] = replaceTransactionData(newTransactionListItems[index], convertBEtoFETransaction(transactionToBE));
        //
        //                                     setTransactionData(processTransactionData(newTransactionListItems))
        //                                 }}
        //                                 onDelete={async (index) => {
        //                                     console.log('onDelete');
        //                                     let newTransactionListItems = [...transactionData];
        //
        //                                     //perform the api call
        //                                     const transactionToDelete = transactionData[index];
        //
        //                                     if (transactionToDelete.id === undefined) return;
        //
        //                                     const response = await StockTransactionAPI.deleteStockTransaction(transactionToDelete.id);
        //                                     if (response.status === APIStatus.FAIL) {
        //
        //                                         console.error('Failed to delete transaction');
        //                                     } else {
        //
        //                                         //on successful delete, remove from frontend list
        //                                         newTransactionListItems.splice(index, 1);
        //
        //                                         setTransactionData(newTransactionListItems);
        //                                     }
        //                                 }}
        //                                 onBack={(index) => {
        //                                     let newTransactionListItems = [...transactionData];
        //                                     newTransactionListItems[index].status = ComponentStatus.VIEW;
        //                                     setTransactionData(newTransactionListItems);
        //                                 }}
        //                             />
        //                         )
        //                     }}
        //                     newItemRenderer={
        //                         <NewTransactionComponent sourceObject={newTransactionData} updateSource={setNewTransactionData} />
        //                     }
        //                     onNew={async () => {
        //
        //                         //validate input and generate correct values
        //
        //                         //generate the value
        //                         const td = convertFEtoBETransaction(newTransactionData);
        //                         console.log(td);
        //                         //send to back end
        //                         const response = await StockTransactionAPI.postStockTransactions(td);
        //                         if (response.status === APIStatus.FAIL) {
        //                             console.error('Failed to create transaction: ' + response.data);
        //                             return;
        //                         }
        //
        //                         //set the id of the transaction - assume only 1
        //                         td.id = response.data[0];
        //                         //parse response and append to list
        //                         let newArray: TransactionData[] = [...transactionData];
        //                         newArray.unshift(convertBEtoFETransaction(td));
        //                         setTransactionData(processTransactionData(newArray));
        //                         setNewTransactionData({...resetNewTransactionData(), stockId: stockData[currentStockIndex].id});
        //                     }}
        //                     onEdit={(index: number) => {
        //                         console.log('onEdit icon');
        //                         let newTransactionListItems = [...transactionData];
        //                         newTransactionListItems[index].status = ComponentStatus.EDIT;
        //                         setTransactionData(newTransactionListItems);
        //                     }}
        //                     onDelete={(index: number) => {
        //                         console.log('onDelete icon');
        //                         let newTransactionListItems = [...transactionData];
        //                         newTransactionListItems[index].status = ComponentStatus.DELETE;
        //                         setTransactionData(newTransactionListItems);
        //                     }}
        //                 >
        //                 </ListContainer>
        //             </div>
        //         </div>
        //     </SectionContainer>
        //     <Modal
        //         isOpen={isOpenNewTrackedStock}
        //         setIsOpen={setIsOpenNewTrackedStock}
        //     >
        //         <h3>Track New Stock</h3>
        //         <FilterableSelect
        //             queryFn={async (args: string) => {
        //
        //                 const response: APIResponse<StockData[]> = await Stock.getStocksByNameOrTicker(args);
        //                 //TODO: handle the fail state
        //                 return response.data.map((data: StockData): FilterableSelectData => {
        //
        //                     return ({
        //                         label: data.name,
        //                         value: data.id.toString(),
        //                         subtext: data.ticker_no
        //                     } as FilterableSelectData);
        //                 });
        //             }}
        //             onSelect={ (selectedValue: FilterableSelectData) => setNewTrackedStock(selectedValue) }
        //         />
        //         <div>Name: {newTrackedStock?.label}</div>
        //         <div>Ticker: {newTrackedStock?.subtext}</div>
        //         <Button onClick={async () => {
        //
        //             if (!newTrackedStock) return;
        //             if (!newTrackedStock.value) return;
        //
        //             const result = await StockAPI.setTrackedStock(Number(newTrackedStock.value));
        //
        //             if (result.status === APIStatus.FAIL) {
        //                 //TODO: handle fail case
        //             }
        //
        //             if (result.status === APIStatus.SUCCESS) {
        //                 //learn something new everyday: can provide usestate with function
        //                 setHasNewTrackedStockCreated(prevState => prevState + 1);
        //                 setIsOpenNewTrackedStock(false);
        //             }
        //         }}>Save</Button>
        //     </Modal>
        //     <Modal
        //         isOpen={isOpenUntrackStock}
        //         setIsOpen={setIsOpenUntrackStock}
        //     >
        //         <h3>Untrack Stock: {untrackStockRef.current >= 0 ? stockData[untrackStockRef.current].ticker_no : ''}</h3>
        //         <p>Are you sure?</p>
        //         <Button onClick={async () => {
        //
        //             //should never happen? no need failsafe?
        //             if (!stockData[untrackStockRef.current]) return;
        //             if (!stockData[untrackStockRef.current].id) return;
        //
        //             const result = await StockAPI.setUntrackedStock(Number(stockData[untrackStockRef.current].id));
        //
        //             if (result.status === APIStatus.FAIL) {
        //                 //TODO: handle fail case
        //             }
        //
        //             if (result.status === APIStatus.SUCCESS) {
        //                 untrackStockRef.current = -1;
        //                 setIsOpenUntrackStock(false);
        //                 setHasNewTrackedStockCreated(prevState => prevState + 1);
        //             }
        //         }}>Delete</Button>
        //     </Modal>
        // </div>
    );
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



export {
    PortfolioDiary
}