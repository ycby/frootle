import './Section.css';
import {ReactNode} from "react";
import Button from "#root/src/helpers/button/Button.tsx";
import {MdDelete} from "react-icons/md";

type SectionContainerProps = {
    className?: string;
    items: SectionContainerItem[];
    onClick: (selected: number) => void;
    onNew: () => void;
    onDelete: (index: number) => void;
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
        onNew,
        onDelete,
        selected,
        children
    } = props;

    return (
        <div className={`section-container ${className ?? ''}`}>
            <div className='section-container__sidebar'>
                <ul>
                    {generateSidebarItems(items, onClick, selected, onDelete)}
                </ul>
                <Button
                    style={{padding: 0}}
                    onClick={() => onNew()}
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

const generateSidebarItems = (sections: SectionContainerItem[], onClick: (item: number) => void, selected: number, onDelete: (index: number) => void) => {

    return sections.map((section, index) => {

        return (
            <li
                key={`${index}-${section.title}`}
                onClick={() => onClick(index)}
                className={`section-container__item ${index === selected ? 'selected' : ''}`}
            >
                {section.title}
                { index === selected &&
                    <MdDelete
                        style={{margin: '4px 2px', cursor: 'pointer'}}
                        onClick={() => {
                            onDelete(index);
                        }}
                    />
                }
            </li>
        )
    });
}

export default SectionContainer;