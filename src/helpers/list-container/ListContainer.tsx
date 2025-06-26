import './ListContainer.css';
import {ReactElement, ReactNode} from "react";
import ListContainerProps = ListContainer.ListContainerProps;

export interface ListItem {
    id: string;
}

export function ListContainer(props: ListContainerProps) {

    const {
        children
    } = props;

    return (
        <div className='list-container'>
            {children}
        </div>
    );
}
export namespace ListContainer {

    type ListContainerHeaderProps = {
        children: ReactNode;
    }

    type ListContainerBodyProps = {
        children: ReactNode
    }

    type ListContainerBodyContentProps = {
        items: any[],
        itemRenderer: (item: any) => ReactElement,
    }

    type ListContainerBodyOverlayProps = {
        isOverlayOpened: boolean,
        children: ReactNode
    }

    export type ListContainerProps = {
        children: ReactNode;
    }

    export const Header = (props: ListContainerHeaderProps) => {

        return (
            <div className='list-container__header'>
                {props.children}
            </div>
        );
    }

    export function Body(props: ListContainerBodyProps) {

        return (
            <div className='list-container__container'>
                {props.children}
            </div>
        );
    }

    export namespace Body {
        export const Content = (props: ListContainerBodyContentProps) => {

            return (generateItems(props.items, props.itemRenderer));
        }

        export const Overlay = (props: ListContainerBodyOverlayProps) => {

            const {
                isOverlayOpened,
                children
            } = props;

            return (
                <div className={`list-container__overlay ${isOverlayOpened ? 'opened' : ''}`}>
                    {children}
                </div>
            );
        }
    }
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
