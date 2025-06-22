import './ListContainer.css';
import {MdAdd} from "react-icons/md";
import {ReactElement} from "react";

export interface ListItem {
    id: string;
}

type ListContainerProps = {
    name: string;
    onAdd: () => void;
    items: any[];
    itemRenderer: (item: any) => ReactElement;
}

const ListContainer = (props: ListContainerProps) => {

    const {
        name,
        onAdd,
        items,
        itemRenderer
    } = props;

    return (
        <div className='list-container'>
            <div className='list-container__header'>
                <h3>{name}</h3>
                <div className='add'>
                    <MdAdd size='24px' />
                </div>
            </div>
            <div className='list-container__container'>
                {generateItems(items, itemRenderer)}
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

export default ListContainer;