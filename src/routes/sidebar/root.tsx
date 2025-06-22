import { Outlet, NavLink } from 'react-router-dom';
import { GiHamburgerMenu } from "react-icons/gi";

import './sidebar.css';

export default function Root() {
	return(
		<div id='main'>
			<div id='sidebar'>
				<div id='sidebar-main'>
					<h1>Contents</h1>
					<nav>
						<NavLink
							to={'portfolio-diary'}
						>
							Portfolio Diary
						</NavLink>
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
					</nav>
				</div>
				<div id='sidebar-thumbnail'>
					<GiHamburgerMenu />
				</div>
			</div>
			<div id='detail'>
				<Outlet />
			</div>
		</div>
	)
}