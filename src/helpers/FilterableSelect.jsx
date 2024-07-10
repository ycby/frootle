import { useState } from 'react';

import './FilterableSelect.css'

export default (props) => {

	// const {
	// 	dataList
	// } = props;

	const dataList = [
		{
			label: 'Main Text 1',
			value: 'uniqueid1',
			subtext: 'Sub-Text 1 - a Brief description'
		},
		{
			label: 'Main Text 2',
			value: 'uniqueid2',
			subtext: 'Sub-Text 2 - a Brief description'
		},
		{
			label: 'Main Text 3',
			value: 'uniqueid3',
			subtext: 'Sub-Text 3 - a Brief description'
		}
	];

	const [value, setValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);


	const filteredList = dataList.filter((item) => {
		
		return item.label.toLowerCase().startsWith(value.toLowerCase()) || item.subtext.toLowerCase().includes(value.toLowerCase())
	});

	return (
		<div
			className='filterable-select'
			onFocus={() => setIsOpen(true)}
			onBlur={() => setIsOpen(false)}
		>
			<input
				type='text'
				name='filterable_select'
				placeholder='Search...'
				onChange={(e) => setValue(e.target.value)}
			/>
			{true &&
			<div
				className='filterable-dropdown'
			>
				{ filteredList.map((item) => createDropdownItem(item, setValue)) }
			</div>
			}
			<span>{ value }</span>
		</div>
	);
}

function createDropdownItem(data, setValue) {

	return (
		<div
			key={data.value}
			data-datavalue={data.value}
			className='dropdown-item'
			onClick={(e) => {
				setValue(e.currentTarget.dataset.datavalue)
			}}
		>
			<span className='main-text'>{ data.label }</span>
			<span className='sub-text'>{ data.subtext }</span>
		</div>
	);
}