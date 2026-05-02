import {NavLink} from "react-router-dom";
import {Offcanvas} from "react-bootstrap";
import {useState} from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import {IoIosReturnLeft} from "react-icons/io";
import {FiHash} from "react-icons/fi";

import './Sidebar.css';

type BaseNavigationType = {
    navigationLabel: string;
    navigationLink?: string;
    children: BaseNavigationType[];
}

const navigationData: BaseNavigationType[] = [
    {
        navigationLink: '/',
        navigationLabel: 'Home',
        children: []
    },
    {
        navigationLabel: 'Short Data',
        children: [
            {
                navigationLabel: 'Short Reporting',
                navigationLink: '/short-reporting',
                children: []
            },
            {
                navigationLabel: 'Fix Data',
                navigationLink: '/data-fix',
                children: []
            }
        ]
    }
]

const Sidebar = () => {

    const [show, setShow] = useState(false);

    return (
        <>
            <Offcanvas className='main-navigation' show={show} onHide={() => setShow(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Where to?</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <nav>
                        <ul>
                            {navigationData.map((element, index) => generateNavigationComponent(element, index, 0))}
                        </ul>
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>
            <div
                id='sidebar-thumbnail'
                onClick={() => setShow(true)}
            >
                <GiHamburgerMenu />
            </div>
        </>
    );
}

const generateNavigationComponent = (element: BaseNavigationType, index: number, depth: number) => {

    return (
        <li key={`bNav_${depth}_${index}`}>
            {
                element.navigationLink !== undefined ?
                <>
                    <NavLink to={element.navigationLink}>
                        {element.navigationLabel}
                    </NavLink>
                    <div className='active-nav'>
                        <FiHash size={16} />
                    </div>
                    <div className='selected-nav'>
                        <IoIosReturnLeft size={24} />
                    </div>
                </> :
                <b>{element.navigationLabel}</b>
            }
            {
                element.children.length === 0 ?
                <></> :
                <ul>
                    {element.children.map((element, index) => generateNavigationComponent(element, index, depth + 1))}
                </ul>
            }
        </li>
    );
}

export default Sidebar;