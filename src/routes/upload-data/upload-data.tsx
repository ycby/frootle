import {useState, useRef, FormEvent,} from 'react';
import Papa, {LocalFile} from 'papaparse';
import {postShortData} from "#root/src/apis/ShortDataAPI.ts";
import {APIStatus} from "#root/src/types.ts";
import {Table} from "react-bootstrap";
import {useAlert} from "#root/src/helpers/alerts/AlertContext.tsx";
import {ListItem, ShortData} from "#root/src/routes/portfolio-diary/types.ts";
import {dateToStringConverter} from "#root/src/helpers/DateHelpers.ts";

type UploadDataMapping = { [p: string]: UploadDataMappingElement };
type UploadDataMappingElement = { label: string; value: string };

type ShortDataRaw = {
	'Stock Code': string;
	'Date': Date;
	'Aggregated Reportable Short Positions (Shares)': number;
	'Aggregated Reportable Short Positions (HK$)': number;
}

type ShortDataLocal = ShortData & ListItem;

const mapping: UploadDataMapping = {
	'index': {
		label: '#',
		value: 'index'
	},
	'Stock Code': {
		label: "Stock Code",
		value: "tickerNo"
	},
	'Stock Name': {
		label: 'Stock Name',
		value: 'name'
	},
	'Date': {
		label: "Reporting Date",
		value: "reportingDate"
	},
	'Aggregated Reportable Short Positions (Shares)': {
		label: "Shorted Shares",
		value: "shortedShares"
	},
	'Aggregated Reportable Short Positions (HK$)': {
		label: "Shorted Amount",
		value: "shortedAmount"
	}
}


//Pending making it a multi-step page
export default function UploadData() {

	const [isFileParsed, setIsFileParsed] = useState<boolean>(false);
	const [fileAsArray, setFileAsArray] = useState<Array<any>>([]);
	const inputRef = useRef<HTMLInputElement>(null);


	const {
		addAlert
	} = useAlert();

	const setFileResult: (data: ShortData[]) => void = (data: ShortData[]): void => {

		setIsFileParsed(true);
		setFileAsArray(data);
	}

	//Put in tabs here
	//but just provide an upload file button first
	return (
		<div style={{width:'100%'}}>
			<h1>We Upload Data Here</h1>

			<h2>Short Data</h2>

			<form
				onSubmit={(e: FormEvent<HTMLFormElement>): Promise<void> => {
					//do some validation on uploaded file

					return processData(e, inputRef.current?.files?.[0] as LocalFile, setFileResult);
				}}
			>
				<input ref={inputRef} type='file' id='upload-short-data' accept='text/csv' name='shortdata' />
				<input type='submit' value='Process' />
			</form>
			{isFileParsed && <span>File Loaded Successfully!</span>}

			{isFileParsed &&
				<Table striped bordered hover>
					<thead>
						<tr>
							{Object.values(mapping).map((item, index) => <th key={`${item.value}_${index}`}>{item.label}</th>)}
						</tr>
					</thead>
					<tbody>
						{fileAsArray.slice(0, 3).map((item, index) => {

							return (
								<tr key={`${item.index}_${index}`}>
									{Object.values(mapping).map((mapping, mappingIndex) => (
										<td key={`${mapping.value}_${mappingIndex}_${index}`}>
											{item[mapping.value] instanceof Date ? dateToStringConverter(item[mapping.value]) : item[mapping.value]}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</Table>
			}
			{
				isFileParsed &&
				<button
					onClick={async () => {

						try {
							const response = await postShortData(fileAsArray);

							if (response.status === APIStatus.SUCCESS) {

								addAlert({
									message: 'Successfully uploaded short data!',
									type: 'success'
								});
								setFileResult([]);
								setIsFileParsed(false);
							} else {

								addAlert({
									message: 'Failed to upload short data!',
									type: 'danger'
								});
							}
						} catch (e) {

							console.error(e);
							addAlert({
								message: 'An error occurred when attempting to upload short data!',
								type: 'danger'
							});
						}
					}}
				>
					Upload
				</button>
			}
		</div>
	)
}

async function processData(e: FormEvent<HTMLFormElement>, fileData: LocalFile, setFileResult: (data: ShortDataLocal[]) => void) {

	console.log('Upload Data Submitted');
	e.preventDefault();
	//Prepare JSON
	Papa.parse<ShortDataRaw>(fileData, {
		complete: (results: Papa.ParseResult<ShortDataRaw>): void => {

			setFileResult(results.data.map((data: any, index: number) => {

				data.index = index + 1;
				return data as ShortDataLocal;
			}));
		},
		header: true,
		transformHeader: (header: any) => {

			if (!Object.hasOwn(mapping, header)) return header;

			return mapping[header as keyof UploadDataMapping].value;
		},
		transform: (value, field) => {

			if (field === 'reportingDate') {

				const dateString = value.split('/');
				return new Date(parseInt(dateString[2]), parseInt(dateString[1]) - 1, parseInt(dateString[0]));
			}

			if (field === 'tickerNo') {

				return value.padStart(5, '0');
			}

			return value;
		},
		error: (err: any) => {

			console.error(err);
		},
		skipEmptyLines: true
	});
}