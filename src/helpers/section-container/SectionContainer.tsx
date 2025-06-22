import './Section.css';
import {ReactNode} from "react";

type SectionContainerProps = {
    items: SectionContainerItems[];
    children: ReactNode;
}

export interface SectionContainerItems {
    name: string;
    id: string;
}

const SectionContainer = (props: SectionContainerProps) => {

    return (
        <div className='section-container'>
            <div className='section-container__sidebar'>
                <ul>
                    {generateSidebarItems(props.items)}
                </ul>
            </div>
            <div className='section-container__content'>
                {props.children}
            </div>
        </div>
    );
}

const generateSidebarItems = (sections: SectionContainerItems[]) => {

    return sections.map(section => {

        return (
            <li key={section.id}>
                {section.name}
            </li>
        )
    });
}

export default SectionContainer;