import {Children, ReactElement, useState} from "react";

import './Tabs.css';

interface TabsProps {
    children: ReactElement;
}

const Tabs = (props: TabsProps): ReactElement => {

    const {
        children,
    } = props;

    const [activeTab, setActiveTab] = useState<number>(0);

    return (
        <div>
            <ul className='tab-buttons-container'>
                {Children.map(children, (child, index) => createTab(child, index, activeTab, setActiveTab))}
            </ul>
            {Children.map(children, (child, index) => createPane(child, index, activeTab))}
        </div>
    )
}

const createTab = (tab: any, index: number, activeTab: number, setActiveTab: (newIndex: number) => void) => {

    return (
        <li
            key={`${index}-${tab.props.title}-tab`}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => {
                setActiveTab(index)
            }}
        >
            {tab.props.title}
        </li>
    )
}

const createPane = (tab: any, index: number, activeTab: number) => {

    return (
        <div
            key={`${index}-${tab.props.title}-body`}
            className={`tab-pane ${activeTab === index ? 'active' : ''}`}
        >
            {tab}
        </div>
    )
}

export default Tabs;