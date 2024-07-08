import { useState, useEffect } from 'react'
import Loading from '../helpers/Loading.jsx'
import TableGenerator from '../helpers/TableGenerator.jsx'

import { Chart, registerables } from 'chart.js'
import { Chart as ReactChartJS } from 'react-chartjs-2'

import './short-reporting.css'

export default function ShortReporting() {
	
	const headers = [
		{
			label: 'Stock Code',
			value: 'stock_code'
		}, 
		{
			label: 'Reporting Date',
			value: 'reporting_date'
		},
		{
			label: 'Shorted Shares',
			value: 'shorted_shares'
		},
		{
			label: 'Shorted Amount',
			value: 'shorted_amount'
		},
		{
			label: 'Created Date',
			value: 'created_datetime'
		},
		{
			label: 'Last Modified Date',
			value: 'last_modified_datetime'
		}
	]

	const jsonMapping = [
		{
			value: 'id',
			type: 'String'
		},
		{
			value: 'stock_code',
			type: 'String'
		}, 
		{
			value: 'reporting_date',
			type: 'Date'
		},
		{
			value: 'shorted_shares',
			type: 'BigInt'
		},
		{
			value: 'shorted_amount',
			type: 'BigInt'
		},
		{
			value: 'created_datetime',
			type: 'Date'
		},
		{
			value: 'last_modified_datetime',
			type: 'Date'
		}
	]
	const [data, setData] = useState([])
	const isLoaded = data.length !== 0

	useEffect(() => {

		async function getShortData() {

			const response = await fetch('http://localhost:3000/shortdata', {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`)

			//TODO: custom set object json
			const jsonResponse = await response.json()

			setData(jsonResponse.map((json) => processJSON(jsonMapping, json)))
		}

		getShortData()
	}, [])

	Chart.register(...registerables)

	return (
		
		<div id='short-reporting'>
			<h1>This is the Short Reporting Page</h1>
			{
				isLoaded ? <ReactChartJS id='short-reporting-chart' type='bar' data={{
					labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
					datasets: [{
						label: 'No of Votes',
						data: [12, 4, 5, 13, 22, 10],
						borderWidth: 1
					}]
				}} />
				:
				Loading()
			}
			{
				isLoaded ? TableGenerator(headers, 
				data, 
				{
					matchHeadersWithData: true
				}) :
				Loading()
			}
		</div>
	)
}

function processJSON(mappings, json) {

	let processedJSON = {}

	for (const mapping of mappings) {

		switch (mapping.type) {
		case 'String':
			processedJSON[mapping.value] = json[mapping.value]
			break
		case 'Date':
			processedJSON[mapping.value] = new Date(json[mapping.value]).toLocaleDateString('en-HK')
			break
		case 'BigInt':
			processedJSON[mapping.value] = BigInt(json[mapping.value]).toLocaleString()
			break
		default:
			console.log('Unexpected Type in Process JSON in Short Reporting')
		}
	}

	return processedJSON
}