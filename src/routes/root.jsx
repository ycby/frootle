export default function Root() {
	return(
		<>
			<div id='sidebar'>
				<h1>React Router Test</h1>
				<nav>
					<ul>
						<li>
							<a href={`/test/1`}>test</a>
						</li>
						<li>
							<a href={`/test/2`}>test2</a>
						</li>
					</ul>
				</nav>
			</div>
			<div id='detail'></div>
		</>
	)
}