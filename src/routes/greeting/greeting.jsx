import { useState, useEffect } from 'react';

export default function ShortReporting() {

	const [environment, setEnvironment] = useState();

	useEffect(() => {

		async function getEnvironment() {

			const response = await fetch('http://localhost:3000/greeting',
			{
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response status: ${response.status}`);

			const jsonResponse = await response.json();
			console.log("json: " + jsonResponse.environment);
			setEnvironment(jsonResponse.environment);
		}

		getEnvironment();
	}, []);

	return (
		
		<div id='greeting'>
			<h1>This is the list of Active Profiles</h1>
			{ createEnvironmentList(environment) }
		</div>
	)
}

function createEnvironmentList(dataList) {

	console.log(dataList);

	if (dataList == undefined) return;
	console.log(dataList.length)

	return (
		<ul>
			{ dataList.map((d, i) => {
				return <li key={i}>{d}</li>
			}) }
		</ul>
	);
}