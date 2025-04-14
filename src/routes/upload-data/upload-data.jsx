import { useState, useRef } from 'react';
import Papa from 'papaparse';
import TableGenerator from "../../helpers/TableGenerator.jsx";

const mapping = {
	'id': {
		label: 'id',
		value: 'id'
	},
	'Stock Code': {
		label: "Stock Code",
		value: "stock_code"
	},
	'Date': {
		label: "Reporting Date",
		value: "reporting_date"
	},
	'Aggregated Reportable Short Positions (Shares)': {
		label: "Shorted Shares",
		value: "shorted_shares"
	},
	'Aggregated Reportable Short Positions (HK$)': {
		label: "Shorted Amount",
		value: "shorted_amount"
	}
}

export default function UploadData() {

	//const [isFileUploaded, setIsFileUploaded] = useState(false);
	const [isFileParsed, setIsFileParsed] = useState(false);
	const [fileAsArray, setFileAsArray] = useState([]);
	const inputRef = useRef(null);

	const setFileResult = (data) => {

		console.log('hello')
		console.log(data);
		setIsFileParsed(true);
		setFileAsArray(data);
	}

	//Put in tabs here
	//but just provide a upload file button first
	return (
		<div>
			<h1>We Upload Data Here</h1>

			<h2>Short Data</h2>

			<form
				onSubmit={(e) => processData(e, inputRef.current.files[0], setFileResult)}
			>
				<input ref={inputRef} type='file' id='upload-short-data' accept='text/csv' name='shortdata' />
				<input type='submit' value='Upload' />
			</form>
			{isFileParsed && <span>File Uploaded Successfully!</span>}

			{isFileParsed &&
				<TableGenerator
					headers={Object.values(mapping)}
					data={fileAsArray.slice(0, 3)}
					options={{
						hiddenColumns: ['id']
					}}
				></TableGenerator>}
		</div>
	)
}

async function processData(e, fileData, setFileResult) {

	console.log('Upload Data Submitted');
	e.preventDefault();
	//Prepare JSON
	Papa.parse(fileData, {
		complete: (results) => {

			setFileResult(results.data.map((data, index) => {

				data.id = index;

				return data;
			}));
		},
		header: true,
		transformHeader: (header) => {

			if (mapping[header] === undefined) return header;

			return mapping[header].value;
		},
		error: (err) => {

			console.error(err);
		},
		skipEmptyLines: true
	});

	// const response = await fetch('http://localhost:8080/shortdata/upload', {
	// 	method: 'POST',
	// 	body: formData
	// })

	//if (response.status == 200) {

	//}
}