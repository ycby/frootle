import './ListContainer.css';
import {ReactElement, ReactNode, useState} from "react";
import Button from "#root/src/helpers/button/Button.tsx";
import {MdAdd, MdDelete, MdEdit} from "react-icons/md";
import {ComponentStatus, ComponentStatusKeys} from "#root/src/types.ts";

export interface ListItem {
    index: number;
    status: ComponentStatusKeys;
}

type ListContainerProps = {
    name: string;
    items: any[];
    itemRenderer: (item: any) => ReactElement;
    newItemRenderer: ReactNode;
    onNew: () => void;
    onEdit: (index: number) => void;
    onDelete: (index: number) => void;
}

export function ListContainer(props: ListContainerProps) {

    const {
        name,
        items,
        itemRenderer,
        newItemRenderer,
        onNew,
        onEdit,
        onDelete
    } = props;

    const [isNewOverlayOpened, setIsNewOverlayOpened] = useState(false);

    return (
        <div className='list-container'>
            <div className='list-container__header'>
                <h3>{name}</h3>
                <div className='list-container__header-item'>
                    <Button
                        onClick={() => {
                            setIsNewOverlayOpened(!isNewOverlayOpened);
                        }}
                    >
                        <MdAdd size='1rem' className={isNewOverlayOpened ? 'rotate-45' : 'rotate-0'} />
                    </Button>
                </div>
            </div>
            <div className={`list-container__container ${isNewOverlayOpened ? 'enable-scroll' : 'enable-scroll'}`}>
                {items.map((item: any) => {

                    return (
                        <div className={`list-container__item ${isNewOverlayOpened ? 'display-none' : ''}`} key={item.id}>
                            <div className={`list-container__item-controls ${item.status !== ComponentStatus.VIEW ? 'display-none' : ''}`}>
                                <MdEdit
                                    style={{margin: '4px 2px', cursor: 'pointer'}}
                                    onClick={() => {
                                        onEdit(item.index);
                                    }}
                                />
                                <MdDelete
                                    style={{margin: '4px 2px', cursor: 'pointer'}}
                                    onClick={() => {
                                        onDelete(item.index);
                                    }}
                                />
                            </div>
                            {itemRenderer(item)}
                        </div>
                    );
                })}
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
            </div>
        </div>
    );
}

//TODO: filter renderer
//should take an object with some attr per type of filter
//E.g If type = date, should require min date + max date, field to filter on