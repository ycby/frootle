export default (headers, data, options) => {

	//Expect:
	//Headers = Array of Objects containing:
	//	Label
	//	Value
	//Data = Array of Objects
	//Options = Object of options

	//preprocess the data so that
	//	Headers not present in data is not shown

	if (options.matchHeadersWithData) {

		headers = handleMatchHeadersWithData(headers, data)
	}

	return (
		<table>
			{ createHeaders(headers) }
			{ createBody(headers, data) }
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

	//only create cell for data which has header
	let validHeaders = headers.filter((header) => data.hasOwnProperty(header.value))

	return (
		<tr key={data.id}>
			{ validHeaders.map((header) => {
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

function handleMatchHeadersWithData(headers, data) {

	if (data == undefined || data.length == 0) return headers

	console.log(`What data am i: ${data}`)

	return headers.filter((header) => data[0].hasOwnProperty(header.value))
}