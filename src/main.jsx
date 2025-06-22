import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	RouterProvider
} from 'react-router-dom';
import Root from './routes/sidebar/root.tsx';
import './index.css';
import ErrorPage from '#root/src/routes/error-page.tsx';
import ShortReporting from '#root/src/routes/short-reporting/short-reporting.tsx';
import UploadData from '#root/src/routes/upload-data/upload-data.tsx';
import {PortfolioDiary} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";


const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/portfolio-diary",
				element: <PortfolioDiary />
			},
			{
				path: 'short-reporting/',
				element: <ShortReporting />
			},
			{
				path: 'upload-data/',
				element: <UploadData />
			}
		]
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)