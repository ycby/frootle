import './ListContainer.css';
import {ReactElement, ReactNode, useState} from "react";
import {IoFilter} from "react-icons/io5";
import Button from "#root/src/helpers/button/Button.tsx";
import {MdAdd} from "react-icons/md";

export interface ListItem {
    id: string;
}

type ListContainerProps = {
    name: string;
    items: any[];
    itemRenderer: (item: any) => ReactElement;
    newItemRenderer: ReactNode;
    filterRenderer: ReactNode;
    onNew: () => void;
}

export function ListContainer(props: ListContainerProps) {

    const {
        name,
        items,
        itemRenderer,
        newItemRenderer,
        filterRenderer,
        onNew
    } = props;

    const [isNewOverlayOpened, setIsNewOverlayOpened] = useState(false);
    const [isFilterOverlayOpened, setIsFilterOverlayOpened] = useState(false);

    return (
        <div className='list-container'>
            <div className='list-container__header'>
                <h3>{name}</h3>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div
                        onClick={() => {
                            setIsFilterOverlayOpened(!isFilterOverlayOpened);
                            if (isNewOverlayOpened) setIsNewOverlayOpened(false);
                        }}
                    >
                        <IoFilter size='24px' style={{margin: '4px'}} />
                    </div>
                    <Button
                        onClick={() => {
                            setIsNewOverlayOpened(!isNewOverlayOpened);
                            if (isFilterOverlayOpened) setIsFilterOverlayOpened(false);
                        }}
                    >
                        <MdAdd size='24px' className={isNewOverlayOpened ? 'rotate-45' : 'rotate-0'} />
                    </Button>
                </div>
            </div>
            <div className='list-container__container'>
                {generateItems(items, itemRenderer)}
                <div className={`list-container__overlay ${isNewOverlayOpened ? 'opened' : ''}`}>
                    <form>
                        {newItemRenderer}
                        <div className='list-container__footer'>
                            <Button onClick={() => {

                                onNew();
                                setIsNewOverlayOpened(false);
                            }}>
                                Save
                            </Button>
                        </div>
                    </form>
                </div>
                <div className={`list-container__overlay ${isFilterOverlayOpened ? 'opened' : ''}`}>
                    {filterRenderer}
                </div>
            </div>
        </div>
    );
}


const generateItems = (items: any[], itemRenderer: (item: any) => ReactElement) => {

    return (items.map(item => {
        return (
            <div className='list-container__item' key={item.id}>
                {itemRenderer(item)}
            </div>
        );
    }));
}

//TODO: filter renderer
//should take an object with some attr per type of filter
//E.g If type = date, should require min date + max date, field to filter on