import './ListContainer.css';
import {ReactElement, ReactNode} from "react";

export interface ListItem {
    id: string;
}

type ListContainerProps = {
    children: ReactNode;
}

const ListContainer = (props: ListContainerProps) => {

    const {
        children
    } = props;

    return (
        <div className='list-container'>
            {children}
        </div>
    );
}

ListContainer.Header = (props) => <div className='list-container__header'>{props.children}</div>
ListContainer.Body = (props) => {

    const {
        items,
        itemRenderer,
        isOverlayOpened,
        children,
    } = props;

    return(
        <div className='list-container__container'>
            {generateItems(items, itemRenderer)}
            <div className={`list-container__overlay ${isOverlayOpened ? 'opened' : ''}`}>
                {children}
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