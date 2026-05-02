import { Outlet } from 'react-router-dom';
import Sidebar from "#root/src/components/navigation-sidebar/Sidebar.tsx";

import {AlertProvider} from "#root/src/helpers/alerts/AlertContext.tsx";

export default function Root() {
	return(
		<AlertProvider>
			<Sidebar />
			<div id='detail'>
				<Outlet />
			</div>
		</AlertProvider>
	)
}