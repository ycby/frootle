import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createBrowserRouter,
	RouterProvider
} from 'react-router-dom';
import Root from './Root.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import ErrorPage from '#root/src/routes/error-page.tsx';
import ShortReportingPage from '#root/src/routes/short-reporting/ShortReportingPage.tsx';
import PortfolioDiary from '#root/src/routes/portfolio-diary/PortfolioDiary.tsx';
import PortfolioPage from '#root/src/routes/portfolio-diary/portfolio-page/PortfolioPage.tsx';
import DataFixPage from '#root/src/routes/data-fix/DataFixPage.tsx';
import StockMergePage from "#root/src/routes/stocks-merge/StockMergePage.tsx";


const router = createBrowserRouter([
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				element: <PortfolioDiary />,
				index: true
			},
			{
				path: 'portfolio',
				children: [
					{
						path: ':id',
						element: <PortfolioPage />,
					}
				]
			},
			{
				path: 'stock-duplicates/',
				element: <StockMergePage />
			},
			{
				path: 'short-reporting/',
				element: <ShortReportingPage />
			},
			{
				path: 'data-fix',
				element: <DataFixPage/>
			}
		]
	}
])

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)