import './TableGenerator.css'

interface TableGeneratorProps {
	headers: Header[],
	data: any[],
	style: any,
	options?: {
		hiddenColumns?: string[];
	}
}

type TableData = {
	id: string;
	[p: string]: any
};
type Header = {
	label: string;
	value: string;
}

export default function TableGenerator(props: TableGeneratorProps) {

	//Expect:
	//Headers = Array of Objects
	//Data = Array of Objects
	//Options = Object of options

	//Options:
	//hidden-columns: array of string = columns which should be not shown on ui

	const {
		headers = [],
		data = [],
		style = {},
		options = {}
	} = props;

	const validHeaders = Object.hasOwn(options, 'hiddenColumns') ? headers.filter(header => !options?.hiddenColumns?.includes(header.value)) : headers;

	return (
		<table style={style} className='table-generator'>
			{ createHeaders(validHeaders) }
			{ createBody(validHeaders, data) }
		</table>
	)
}

function createHeaders(headers: Header[]) {

	return (
		<thead>
			<tr>
				{ headers.map((header) => <th key={header.value}>{ header.label }</th>) }
			</tr>
		</thead>
	)
}

function createBody(headers: Header[], data: any[]) {

	return (
		<tbody>
			{ data.map((d) => createRow(headers, d)) }
		</tbody>
	)
}

function createRow(headers: Header[], data: TableData) {

	return (
		<tr key={data.id}>
			{ headers.map((header) => {
					return (
						<td key={`${data.id}_${header.value}`}>
							{ data[header.value].toString() }
						</td>
					)
				})
			}
		</tr>
	)
}