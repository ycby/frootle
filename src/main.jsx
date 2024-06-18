import React from 'react'
import ReactDOM from 'react-dom/client'
import {
	createBrowserRouter,
	RouterProvider
} from 'react-router-dom'
import Root from './routes/root.jsx'
import './index.css'

//TODO: Remove Appcss and Appjsx
const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)