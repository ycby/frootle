import { Outlet, Link } from 'react-router-dom'

export default function Root() {
	return(
		<>
			<div id='sidebar'>
				<h1>React Router Test</h1>
				<nav>
					<ul>
						<li>
							<Link to={`/short-reporting`}>Short Reporting</Link>
						</li>
						<li>
							<Link to={`/test/2`}>test2</Link>
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