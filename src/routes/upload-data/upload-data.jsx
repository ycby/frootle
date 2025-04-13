import { useState, useRef } from 'react';
import Papa from 'papaparse';

export default () => {

	const [isFileUploaded, setIsFileUploaded] = useState(false);
	const inputRef = useRef(null);

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
				onSubmit={(e) => submitData(e, inputRef.current.files[0], setIsFileUploaded)}
			>
				<input ref={inputRef} type='file' id='upload-short-data' accept='text/csv' name='shortdata' />
				<input type='submit' value='Upload' />
			</form>
			{isFileUploaded && <span>File Uploaded Successfully!</span>}
		</div>
	)
}

async function submitData(e, fileData, setIsFileUploaded) {

	e.preventDefault();

	console.log(fileData)
	//Prepare JSON
	Papa.parse(fileData, {
		complete: function(results) {
			console.log(results);
		},
		header: true,
		transformHeader: function(header, index) {

			switch (header) {
				case 'Date':
					return 'reporting_date';
				case 'Stock Code':
					return 'stock_code';
				case 'Aggregated Reportable Short Positions (Shares)':
					return 'shorted_shares';
				case 'Aggregated Reportable Short Positions (HK$)':
					return 'shorted_amount';
				default:
					return header;
			}
		}
	})

	// const response = await fetch('http://localhost:8080/shortdata/upload', {
	// 	method: 'POST',
	// 	body: formData
	// })

	if (response.status == 200) {

		setIsFileUploaded(true);
	}
}