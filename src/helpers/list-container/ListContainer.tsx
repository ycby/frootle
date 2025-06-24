import './ListContainer.css';
import {MdAdd} from "react-icons/md";
import {ReactElement, useState} from "react";
import Button from "#root/src/helpers/button/Button.tsx";

export interface ListItem {
    id: string;
}

type ListContainerProps = {
    name: string;
    items: any[];
    itemRenderer: (item: any) => ReactElement;
    onAdd: (item: any) => void;
    onAddRenderer: () => ReactElement;
}

const ListContainer = (props: ListContainerProps) => {

    const {
        name,
        items,
        itemRenderer,
        onAdd,
        onAddRenderer,
    } = props;

    const [isAddItemComponentOpen, setIsAddItemComponentOpen] = useState(false);

    const addItemContainerClassName = isAddItemComponentOpen ? 'opened' : '';

    return (
        <div className='list-container'>
            <div className='list-container__header'>
                <h3>{name}</h3>
                <Button
                    onClick={() => {
                        setIsAddItemComponentOpen(true);
                    }}
                >
                    <MdAdd size='24px' />
                </Button>
            </div>
            <div className='list-container__container'>
                {generateItems(items, itemRenderer)}
                <div className={`list-container__add-item-container ${addItemContainerClassName}`}>
                    <form>
                        {onAddRenderer()}
                        <div className='list-container__footer'>
                            <Button onClick={() => {
                                setIsAddItemComponentOpen(false);
                            }}>
                                Back
                            </Button>
                            <Button onClick={onAdd}>
                                Save
                            </Button>
                        </div>
                    </form>
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

export default ListContainer;