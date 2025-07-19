import './Section.css';
import {ReactNode} from "react";

type SectionContainerProps = {
    className?: string;
    items: SectionContainerItem[];
    onClick: (selected: number) => void;
    selected: number;
    children: ReactNode;
}

export interface SectionContainerItem {
    ticker_no: string;
    id: number;
}

const SectionContainer = (props: SectionContainerProps) => {

    const {
        className,
        items,
        onClick,
        selected,
        children
    } = props;

    return (
        <div className={`section-container ${className ?? ''}`}>
            <div className='section-container__sidebar'>
                <ul>
                    {generateSidebarItems(items, onClick, selected)}
                </ul>
            </div>
            <div className='section-container__content'>
                {children}
            </div>
        </div>
    );
}

const generateSidebarItems = (sections: SectionContainerItem[], onClick: (item: number) => void, selected: number) => {

    return sections.map((section, index) => {

        return (
            <li
                key={section.id}
                onClick={() => onClick(index)}
                className={`section-container__item ${index === selected ? 'selected' : ''}`}
            >
                {section.ticker_no}
            </li>
        )
    });
}

export default SectionContainer;