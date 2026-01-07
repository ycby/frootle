import { Outlet } from 'react-router-dom';
import Sidebar from "#root/src/routes/sidebar/Sidebar.tsx";

import './Root.css';
import {AlertProvider} from "#root/src/helpers/alerts/AlertContext.tsx";

export default function Root() {
	return(
		<AlertProvider>
			<div id='main'>
				<Sidebar />
				<div id='detail'>
					<Outlet />
				</div>
			</div>
		</AlertProvider>
	)
}