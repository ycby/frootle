import { Outlet, Link } from 'react-router-dom'

export default function Root() {
	return(
		<>
			<div id='sidebar'>
				<h1>React Router Test</h1>
				<nav>
					<ul>
						<li>
							<Link to={`/greeting`}>Greeting</Link>
						</li>
						<li>
							<Link to={`/short-reporting`}>Short Reporting</Link>
						</li>
						<li>
							<Link to={`/upload-data`}>Upload Data</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div id='detail'>
				<Outlet />
			</div>
		</>
	)
}