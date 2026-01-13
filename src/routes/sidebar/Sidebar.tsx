import {NavLink} from "react-router-dom";
import {GiHamburgerMenu} from "react-icons/gi";

import './Sidebar.css';

const Sidebar = () => {

    return (
        <div id='sidebar'>
            <div id='sidebar-main'>
                <h1><NavLink to='/'>Home</NavLink></h1>
                <nav>
                    <NavLink
                        to={'/short-reporting'}
                    >
                        Short Reporting
                    </NavLink>
                    <NavLink
                        to={'upload-data'}
                    >
                        Upload Data
                    </NavLink>
                    <NavLink
                        to={'/data-fix'}
                    >
                        Fix Data
                    </NavLink>
                </nav>
            </div>
            <div id='sidebar-thumbnail'>
                <GiHamburgerMenu />
            </div>
        </div>
    );
}

export default Sidebar;