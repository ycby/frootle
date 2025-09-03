import {useState, useRef, FormEvent,} from 'react';
import Papa, {LocalFile} from 'papaparse';
import {TableGenerator} from "#root/src/helpers/table-generator/TableGenerator.tsx";
import {postShortData} from "#root/src/apis/ShortDataAPI.ts";
import {APIStatus} from "#root/src/types.ts";

type UploadDataMapping = { [p: string]: UploadDataMappingElement };
type UploadDataMappingElement = { label: string; value: string };

type ShortDataRaw = {
	'Stock Code': string;
	'Date': Date;
	'Aggregated Reportable Short Positions (Shares)': number;
	'Aggregated Reportable Short Positions (HK$)': number;
}

interface ShortData {
	id: number; //only for handling on frontend side, not used in backend
	stock_code: string;
	reporting_date: Date;
	shorted_shares: number;
	shorted_amount: number;
}

const mapping: UploadDataMapping = {
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


//Pending making it a multi-step page
export default function UploadData() {

	const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
	const [isFileParsed, setIsFileParsed] = useState<boolean>(false);
	const [fileAsArray, setFileAsArray] = useState<Array<any>>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const [hasError, setHasError] = useState<boolean>(false);

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
				<TableGenerator
					style={{width:'100%'}}
					headers={Object.values(mapping)}
					data={fileAsArray.slice(0, 3)}
					options={{
						hiddenColumns: ['id']
					}}
				></TableGenerator>
			}
			{
				isFileParsed &&
				<button
					onClick={async () => {

						try {
							const response = await postShortData(fileAsArray);

							if (response.status === APIStatus.SUCCESS) {

								setIsFileUploaded(true);
							} else {

								setHasError(true);
							}
						} catch (e) {

							console.error(e);
							setIsFileUploaded(false);
						}
					}}
				>
					Upload
				</button>
			}

			{isFileUploaded && !hasError &&
				<span>The data was uploaded successfully!</span>
			}
			{isFileUploaded && hasError &&
				<span>There was an error uploading the data!</span>
			}
		</div>
	)
}

async function processData(e: FormEvent<HTMLFormElement>, fileData: LocalFile, setFileResult: (data: ShortData[]) => void) {

	console.log('Upload Data Submitted');
	e.preventDefault();
	//Prepare JSON
	Papa.parse<ShortDataRaw>(fileData, {
		complete: (results: Papa.ParseResult<ShortDataRaw>): void => {

			setFileResult(results.data.map((data: any, index: number) => {

				data.id = index;

				return data as ShortData;
			}));
		},
		header: true,
		transformHeader: (header: any) => {

			if (!Object.hasOwn(mapping, header)) return header;

			return mapping[header as keyof UploadDataMapping].value;
		},
		transform: (value, field) => {

			if (field === 'reporting_date') {

				const dateString = value.split('/');
				return new Date(parseInt(dateString[2]), parseInt(dateString[1]) - 1, parseInt(dateString[0]));
			}

			return value;
		},
		error: (err: any) => {

			console.error(err);
		},
		skipEmptyLines: true
	});
}