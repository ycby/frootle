import {useState, useEffect, ReactElement} from 'react';
import Loading from '#root/src/helpers/loading/Loading.tsx';
import { FilterableSelect } from '#root/src/helpers/filterable-select/FilterableSelect.tsx';

import { Chart, registerables } from 'chart.js';
import { Chart as ReactChartJS } from 'react-chartjs-2';

import 'chartjs-adapter-date-fns';

import './short-reporting.css';
import {DatePicker} from "#root/src/helpers/date-picker/DatePicker.tsx";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";
import * as StockAPI from "#root/src/apis/StockAPI.ts";
import * as ShortDataAPI from "#root/src/apis/ShortDataAPI.ts";
import {ShortData, StockData} from "#root/src/routes/portfolio-diary/types.ts";
import {APIResponse} from '#root/src/types.ts';
import {Table} from "react-bootstrap";

type ChartPoint = {
	x: number;
	y: number;
}

const headers = [
	{
		label: 'Stock Id',
		value: 'stockId'
	},
	{
		label: 'Reporting Date',
		value: 'reportingDate',
		transform: (element:any) => dateToStringConverter(element)
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
		value: 'createdDatetime',
		transform: (element:any) => dateToStringConverter(element)
	},
	{
		label: 'Last Modified Date',
		value: 'lastModifiedDatetime',
		transform: (element:any) => dateToStringConverter(element)
	}
]

export default function ShortReporting() {

	const [data, setData] = useState<ShortData[]>([]);
	const [chartData, setChartData] = useState<ChartPoint[]>([]);

	const [selectedStock, setSelectedStock] = useState<StockData | null>();

	const dateToday = new Date();
	const [startDate, setStartDate] = useState<Date | null>(new Date(dateToday.getFullYear() - 1, dateToday.getMonth(), dateToday.getDate()));
	const [endDate, setEndDate] = useState<Date | null>(dateToday);

	let currentStatus = '';
	if (selectedStock == null) {
		currentStatus = 'UNLOADED';
	} else if (data.length === 0) {
		currentStatus = 'LOADING';
	} else {
		currentStatus = 'LOADED';
	}

	useEffect(() => {

		async function getShortData() {

			if (!selectedStock) return;

			const response = await ShortDataAPI.getShortData(selectedStock.id.toString(), dateToStringConverter(startDate), dateToStringConverter(endDate));

			const processedData: ShortData[] = response.data;

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
				queryFn={async (args: string): Promise<StockData[]> => {

					const response: APIResponse<StockData[]> = await StockAPI.getStocksByNameOrTicker(args);
					//TODO: handle the fail state
					return response.data;
				}}
				onSelect={ (selectedValue: StockData): void => setSelectedStock(selectedValue) }
				setInputValue={ (item: StockData): string => item.name }
				renderItem={ (data: StockData): ReactElement => (
					<>
						<span className='main-text'>{ data.name }</span>
						<span className='sub-text'>{ data.tickerNo }</span>
					</>
				)}
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
				<Table>
					<thead>
						<tr>
							{Object.values(headers).map((header, index) => <th key={`${header.value}_${index}`}>{header.label}</th>)}
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => {

							return (
								<tr key={`${item.id}_${index}`}>
									{Object.values(headers).map((mapping, mappingIndex) => {

										return (
											<td
												key={`${item.id}_${index}_${mappingIndex}`}
											>
												{`${mapping.transform ? mapping.transform(item[mapping.value as keyof ShortData]) : item[mapping.value as keyof ShortData]}`}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</Table>
			}
		</div>
	)
}