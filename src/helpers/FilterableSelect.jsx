import { useState, useEffect, useRef } from 'react';
import FilterableSelectItem from './FilterableSelectItem.jsx';
import { MdOutlineSearch } from "react-icons/md";

import './FilterableSelect.css'

export default (props) => {

	const {
		dataList = [],
		onSelect
	} = props;

	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const filterableRef = useRef();
	const dropdownElements = useRef([]);
	const selectedIndex = useRef(-1);

	const filteredList = dataList.filter((item) => {

		return item.label.toLowerCase().startsWith(searchTerm.toLowerCase()) || item.subtext.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<div
			className='filterable-select'
		>
			<input
				ref={ filterableRef }
				type='text'
				name='filterable_select'
				placeholder='Search...'
				onChange={(e) => {
					setSearchTerm(e.target.value)
				}}
				value={ searchTerm }
				onFocus={(e) => setIsOpen(true)}
				onBlur={(e) => {
					if(filterableRef.current !== e.currentTarget) setIsOpen(false);
				}}
				onKeyDown={(e) => keyDownController(e, filterableRef, filteredList, dropdownElements, selectedIndex)}
			/>
			{isOpen &&
				<div
					className='filterable-dropdown'
				>
					{ filteredList.map((item, index) => 
						<FilterableSelectItem
							ref={ (el) => dropdownElements.current[index] = el}
							key={ item.value }
							tabIndex={ index }
							data={ item }
							setData={ (id) => {
								const childItem = filteredList.find((item) => item.value == id);
								setIsOpen(false);
								setSearchTerm(childItem.label);
								onSelect(childItem);
							}}
							onKeyDown={(e) => keyDownController(e, filterableRef, filteredList, dropdownElements, selectedIndex)}
						/>
					)}
				</div>
			}
		</div>
	);
}

function keyDownController(e, filterableRef, filteredList, dropdownElements, selectedIndex) {

	switch (e.key) {
	case 'ArrowDown':
		e.preventDefault();
		selectedIndex.current = updateSelectedItem(filterableRef.current, filteredList, dropdownElements.current, selectedIndex.current, 1);
		console.log('Down pressed');
		break;
	case 'ArrowUp':
		e.preventDefault();
		selectedIndex.current = updateSelectedItem(filterableRef.current, filteredList, dropdownElements.current, selectedIndex.current, -1);
		console.log('Up pressed');
		break;
	case 'Enter':
		console.log('Enter Pressed');

		break;
	default:
		console.log('No valid key');
	}
}

function updateSelectedItem(inputRef, filteredList, dropdownElements, initialIndex, valueIncrement) {

	if (filteredList.length <= 0) return -1;
	
	if (initialIndex + valueIncrement < 0) {
	
		inputRef.focus();
		return -1;
	}

	console.log(`filteredList: ${filteredList.length}`)
	console.log(dropdownElements)
	
	console.log(`initialINdex: ${initialIndex}`)
	const updatedIndex = clamp(initialIndex + valueIncrement, filteredList.length - 1, 0);
	console.log(`updatedIndex: ${updatedIndex}`)

	dropdownElements[updatedIndex].focus();

	return updatedIndex;
}

function clamp(index, upperBound, lowerBound) {

	console.log(`${index}, ${upperBound}, ${lowerBound}`)
	if (index > upperBound) return upperBound;
	if (index < lowerBound) return lowerBound;
	return index;
}