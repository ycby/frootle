import { useState, useEffect } from 'react';
import Loading from '#root/src/helpers/loading/Loading.tsx';
import {TableGenerator} from '#root/src/helpers/table-generator/TableGenerator.tsx';
import { FilterableSelect } from '#root/src/helpers/filterable-select/FilterableSelect.tsx';

import { Chart, registerables } from 'chart.js';
import { Chart as ReactChartJS } from 'react-chartjs-2';

import 'chartjs-adapter-date-fns';

import './short-reporting.css';
import {DatePicker} from "#root/src/helpers/date-picker/DatePicker.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as Stock from "#root/src/apis/StockAPI.ts";
import * as ShortDataAPI from "#root/src/apis/ShortDataAPI.ts";
import {ShortData, StockData} from "#root/src/routes/portfolio-diary/types.ts";
import {FilterableSelectData} from "#root/src/helpers/filterable-select/FilterableSelectItem.tsx";
import {APIResponse} from '#root/src/types.ts';

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
		label: 'Stock Id',
		value: 'stock_id'
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
		value: 'stock_id',
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

	const [data, setData] = useState<ShortData[]>([]);
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

		async function getShortData() {

			if (!selectedStock.value) return;

			const response = await ShortDataAPI.getShortData(selectedStock.value, dateToStringConverter(startDate), dateToStringConverter(endDate));

			const processedData: ShortData[] = response.data.map((json: any) => processJSON(jsonMapping, json) as ShortData);

			setData(processedData);
			setChartData(response.data.map((d: any): ChartPoint => {
				return {
					x: d.reporting_date,
					y: d.shorted_shares
				}
			}).reverse());
		}

		getShortData();
	}, [selectedStock, startDate, endDate])

	Chart.register(...registerables,
		{
			id: 'vertical-line',
			afterDraw: (chart) => {

				if (chart.tooltip?.getActiveElements().length) {

					let ctx = chart.ctx;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(chart.tooltip?.getActiveElements()[0].element.x, chart.scales.y.bottom);
					ctx.lineTo(chart.tooltip?.getActiveElements()[0].element.x, chart.scales.y.top);
					ctx.lineWidth = 2;
					ctx.strokeStyle = 'rgb(255, 0, 0)';
					ctx.stroke();
					ctx.restore();
				}
			}
		}
	);

	return (
		
		<div id='short-reporting'>
			<h1>This is the Short Reporting Page</h1>
			<FilterableSelect
				queryFn={async (args: string) => {

					const response: APIResponse<StockData[]> = await Stock.getStocksByNameOrTicker(args);
					//TODO: handle the fail state
					return response.data.map((data: StockData): FilterableSelectData => {

						return ({
							label: data.name,
							value: data.id.toString(),
							subtext: data.ticker_no
						} as FilterableSelectData);
					});
				}}
				onSelect={ (selectedValue: FilterableSelectData) => setSelectedStock(selectedValue) }
			/>
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
							},
							interaction: {
								intersect: false,
								mode: 'x',
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