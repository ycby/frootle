import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider
} from 'react-router-dom'
import Root from './routes/root.jsx'
import './index.css'
import ErrorPage from './routes/error-page.jsx'
import ShortReporting from './routes/short-reporting.jsx'
import UploadData from './routes/upload-data.jsx'


const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
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