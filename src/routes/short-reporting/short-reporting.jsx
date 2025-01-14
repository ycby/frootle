import { useState, useEffect, useRef } from 'react';
import Loading from '../../helpers/Loading.jsx';
import TableGenerator from '../../helpers/TableGenerator.jsx';
import FilterableSelect from '../../helpers/FilterableSelect.jsx';

import { Chart, registerables } from 'chart.js';
import { Chart as ReactChartJS } from 'react-chartjs-2';

import { enGB } from 'date-fns/locale';
import 'chartjs-adapter-date-fns';

import './short-reporting.css';

//Test Data
const dataList = [
	{
		label: 'Main Text 1',
		value: 'uniqueid1',
		subtext: 'Sub-Text 1 - a Brief description'
	},
	{
		label: 'Main Text 2',
		value: 'uniqueid2',
		subtext: 'Sub-Text 2 - a Brief description'
	},
	{
		label: 'Main Text 3',
		value: 'uniqueid3',
		subtext: 'Sub-Text 3 - a Brief description'
	}
];

export default function ShortReporting() {
	
	const headers = [
		{
			label: 'Stock Code',
			value: 'stockCode'
		}, 
		{
			label: 'Reporting Date',
			value: 'reportingDate'
		},
		{
			label: 'Shorted Shares',
			value: 'shortedShares'
		},
		{
			label: 'Shorted Amount',
			value: 'shortedAmount'
		},
		{
			label: 'Created Date',
			value: 'createdDateTime'
		},
		{
			label: 'Last Modified Date',
			value: 'lastModifiedDateTime'
		}
	]

	const jsonMapping = [
		{
			value: 'id',
			type: 'String'
		},
		{
			value: 'stockCode',
			type: 'String'
		}, 
		{
			value: 'reportingDate',
			type: 'Date'
		},
		{
			value: 'shortedShares',
			type: 'Long'
		},
		{
			value: 'shortedAmount',
			type: 'Long'
		},
		{
			value: 'createdDateTime',
			type: 'Date'
		},
		{
			value: 'lastModifiedDateTime',
			type: 'Date'
		}
	]

	const [data, setData] = useState([]);
	const [stockData, setStockData] = useState([]);
	const [chartData, setChartData] = useState([]);

	const [selectedStock, setSelectedStock] = useState({});

	const isLoaded = data.length !== 0;

	useEffect(() => {

		async function getStockData() {

			const response = await fetch('http://localhost:8080/stock/all', {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`);

			const jsonResponse = await response.json();
			console.log(jsonResponse)

			setStockData(jsonResponse.map((json) => {

				return {
					label: json.name,
					value: json.code,
					subtext: json.code
				}
			}));
		}

		getStockData();
	}, [])

	useEffect(() => {
		console.log(selectedStock)
		async function getShortData() {

			const response = await fetch(`http://localhost:8080/short/${selectedStock.value}`, {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`)

			//TODO: custom set object json
			const jsonResponse = await response.json()

			setData(jsonResponse.map((json) => processJSON(jsonMapping, json)));
			setChartData(jsonResponse.map((d) => {
				return {
					x: d.reportingDate,
					y: d.shortedShares
				}
			}).reverse());
		}

		getShortData();
	}, [selectedStock])

	Chart.register(...registerables)

	return (
		
		<div id='short-reporting'>
			<h1>This is the Short Reporting Page</h1>
			<FilterableSelect dataList={ stockData } onSelect={ (selectedValue) => setSelectedStock(selectedValue) } />
			{
				isLoaded ? 
				<ReactChartJS
					id='short-reporting-chart'
					type='line'
					data={{
						datasets: [{
							data: chartData
						}]
					}}
					options={{
						scales: {
							x: {
								type: 'time',
								time: {
									unit: 'month'
								}
							},
							y: {
								min: 0
							}
						}
					}}
				/>
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
	console.log(mappings)
	console.log(json)
	for (const mapping of mappings) {

		switch (mapping.type) {
		case 'String':
			processedJSON[mapping.value] = json[mapping.value]
			break
		case 'Date':
			processedJSON[mapping.value] = new Date(json[mapping.value]).toLocaleDateString('en-HK')
			break
		case 'Long':
			processedJSON[mapping.value] = json[mapping.value]
			break
		default:
			console.log('Unexpected Type in Process JSON in Short Reporting')
		}
	}

	return processedJSON
}