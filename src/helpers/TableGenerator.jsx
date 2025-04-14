import './TableGenerator.css'

export default function TableGenerator(props) {

	//Expect:
	//Headers = Array of Objects containing:
	//	Label
	//	Value
	//Data = Array of Objects
	//Options = Object of options

	//Options:
	//hidden-columns: array of string = columns which should be not shown on ui

	const {
		headers = [],
		data = [],
		options = {}
	} = props;

	const validHeaders = Object.hasOwn(options, 'hiddenColumns') ? headers.filter(header => !options.hiddenColumns.includes(header.value)) : headers;
	console.log(validHeaders)
	return (
		<table className='table-generator'>
			{ createHeaders(validHeaders) }
			{ createBody(validHeaders, data) }
		</table>
	)
}

function createHeaders(headers) {

	return (
		<thead>
			<tr>
				{ headers.map((header) => <th key={header.value}>{ header.label }</th>) }
			</tr>
		</thead>
	)
}

function createBody(headers, data) {

	return (
		<tbody>
			{ data.map((d) => createRow(headers, d)) }
		</tbody>
	)
}

function createRow(headers, data) {

	return (
		<tr key={data.id}>
			{ headers.map((header) => {
					return (
						<td key={`${data.id}_${header.value}`}>
							{ data[header.value] }
						</td>
					)
				})
			}
		</tr>
	)
}