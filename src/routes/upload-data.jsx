import { useState } from 'react'

export default () => {

	const [isFileUploaded, setIsFileUploaded] = useState(false)

	const mapping = [
		{
			label:"Stock Code",
			value:"stock_code",
			column: "Stock Code"
		},
		{
			label:"Reporting Date",
			value:"reporting_date",
			column: "Date"
		},
		{
			label:"Shorted Shares",
			value:"shorted_shares",
			column: "Aggregated Reportable Short Positions (Shares)"
		},
		{
			label:"Shorted Amount",
			value:"shorted_amount",
			column: "Aggregated Reportable Short Positions (HK$)"
		}
	]

	//Put in tabs here
	//but just provide a upload file button first
	return (
		<div>
			<h1>We Upload Data Here</h1>

			<h2>Short Data</h2>

			<form
				onSubmit={(e) => submitData(e, setIsFileUploaded)}
			>
				<input type='file' id='upload-short-data' accept='text/csv' name='shortdata' />
				<input type='hidden' name='mapping' value={JSON.stringify(mapping)} />
				<input type='submit' value='Upload' />
			</form>
			{isFileUploaded && <span>File Uploaded Successfully!</span>}
		</div>
	)
}

async function submitData(event, setIsFileUploaded) {

	event.preventDefault()

	//create multipart formdata
	const formData = new FormData(event.target)

	const response = await fetch('http://localhost:3000/shortdata/upload', {
		method: 'POST',
		body: formData
	})

	if (response.status == 200) {

		setIsFileUploaded(true)
	}
}