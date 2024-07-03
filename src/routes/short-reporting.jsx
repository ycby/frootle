import { useState, useEffect } from 'react'
import Loading from '../helpers/Loading.jsx'
import TableGenerator from '../helpers/TableGenerator.jsx'

export default function ShortReporting() {
	
	const [data, setData] = useState([])
	const isLoaded = data.length !== 0

	useEffect(() => {

		async function getShortData() {

			const response = await fetch('http://localhost:3000/shortdata', {
				method: 'GET'
			})

			if (!response.ok) throw new Error(`Response Status: ${response.status}`)

			//TODO: custom set object json
			setData(await response.json());
		}

		getShortData()
	}, [])

	console.log(data)

	return (
		
		<div id='short-reporting'>
			<h1>This is the Short Reporting Page</h1>
			{ isLoaded ? TableGenerator([
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
				},
				{
					label: 'ayylmao',
					value: 'pepsi'
				}], 
			data, 
			{
				matchHeadersWithData: true
			}) :
			Loading()
			}
		</div>
	)
}