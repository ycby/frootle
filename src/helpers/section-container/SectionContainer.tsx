import './Section.css';
import {ReactNode} from "react";
import Button from "#root/src/helpers/button/Button.tsx";

type SectionContainerProps = {
    className?: string;
    items: SectionContainerItem[];
    onClick: (selected: number) => void;
    selected: number;
    children: ReactNode;
}

export interface SectionContainerItem {
    title: string;
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
                <Button
                    style={{padding: 0}}
                    onClick={() => {}}
                >
                    +
                </Button>
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
                key={`${index}-${section.title}`}
                onClick={() => onClick(index)}
                className={`section-container__item ${index === selected ? 'selected' : ''}`}
            >
                {section.title}
            </li>
        )
    });
}

export default SectionContainer;