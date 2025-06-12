import { useState, useEffect } from 'react';
import Loading from '../../helpers/Loading.tsx';
import TableGenerator from '../../helpers/table-generator/TableGenerator.tsx';
import { FilterableSelect, FilterableSelectData } from '../../helpers/filterable-select/FilterableSelect.tsx';

import { Chart, registerables } from 'chart.js';
import { Chart as ReactChartJS } from 'react-chartjs-2';

import 'chartjs-adapter-date-fns';

import './short-reporting.css';
import {DatePicker} from "../../helpers/date-picker/DatePicker.tsx";
import {dateToStringConverter} from "../../helpers/DateHelpers.ts";

type ShortReportingMapping = {
	value: string;
	type: string;
}

type ChartPoint = {
	x: number;
	y: number;
}

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

const jsonMapping: ShortReportingMapping[] = [
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
		type: 'Long'
	},
	{
		value: 'shorted_amount',
		type: 'Long'
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

export default function ShortReporting() {

	const [data, setData] = useState([]);
	const [stockData, setStockData] = useState<FilterableSelectData[]>([]);
	const [chartData, setChartData] = useState<ChartPoint[]>([]);

	const [selectedStock, setSelectedStock] = useState<FilterableSelectData>({label: null, value: null, subtext: null});

	const dateToday = new Date();
	const [startDate, setStartDate] = useState<Date | null>(new Date(dateToday.getFullYear() - 1, dateToday.getMonth(), dateToday.getDate()));
	const [endDate, setEndDate] = useState<Date | null>(dateToday);

	let currentStatus = '';
	if (selectedStock == null || selectedStock.value == null) {
		currentStatus = 'UNLOADED';
	} else if (data.length === 0) {
		currentStatus = 'LOADING';
	} else {
		currentStatus = 'LOADED';
	}

	useEffect(() => {

		async function getStockData() {

			const response = await fetch('http://localhost:3000/stock', {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`);

			const jsonResponse = await response.json();
			console.log(jsonResponse)

			setStockData(jsonResponse.data.map((json: any): FilterableSelectData => {

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

		async function getShortData() {

			const response = await fetch(`http://localhost:3000/short?stock_code=${selectedStock.value}&start_date=${dateToStringConverter(startDate)}&end_date=${dateToStringConverter(endDate)}`, {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`)

			//TODO: custom set object json
			const jsonResponse = await response.json()

			setData(jsonResponse.data.map((json: any) => processJSON(jsonMapping, json)));
			setChartData(jsonResponse.data.map((d: any): ChartPoint => {
				return {
					x: d.reporting_date,
					y: d.shorted_shares
				}
			}).reverse());
		}

		getShortData();
	}, [selectedStock, startDate, endDate])

	Chart.register(...registerables)

	return (
		
		<div id='short-reporting'>
			<h1>This is the Short Reporting Page</h1>
			<FilterableSelect dataList={ stockData } onSelect={ (selectedValue: FilterableSelectData) => setSelectedStock(selectedValue) } />
			<div id='filter-group'>
				<div className='filter-element'>
					<DatePicker label='Start Date' value={startDate} onChange={(date) => setStartDate(date)} />
				</div>
				<div className='filter-element'>
					<DatePicker label='End Date' value={endDate} onChange={(date) => setEndDate(date)} />
				</div>
			</div>
			<div className='chart'>
				{
					currentStatus === 'UNLOADED' ?
						<div></div> :
						currentStatus === 'LOADING' ?
							<Loading /> :
							<ReactChartJS
								id='short-reporting-chart'
								type='line'
								data={{
									datasets: [{
										label: 'Shorted Quantity',
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
									},
									plugins: {
										legend: {
											position: 'right'
										}
									}
								}}
							/>
				}
			</div>

			{
				currentStatus === 'UNLOADED' ?
				<div></div> :
				currentStatus === 'LOADING' ?
				<Loading /> :
				<TableGenerator headers={headers} data={data}></TableGenerator>
			}
		</div>
	)
}

const processJSON = (mappings: ShortReportingMapping[], json: any) => {

	let processedJSON: any = {}

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

	return processedJSON;
}