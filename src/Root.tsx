import { Outlet } from 'react-router-dom';
import Sidebar from "#root/src/routes/sidebar/Sidebar.tsx";

import './Root.css';

export default function Root() {
	return(
		<div id='main'>
			<Sidebar />
			<div id='detail'>
				<Outlet />
			</div>
		</div>
	)
}