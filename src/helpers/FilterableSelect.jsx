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
				onKeyDown={(e) => {
					keyDownController(e, filterableRef, filteredList, dropdownElements, selectedIndex)

					//get search key
					if (e.key == 'Enter' && filteredList.length != 0) {

						const childItem = filteredList[0];
						setIsOpen(false);
						setSearchTerm(childItem.label);
						onSelect(childItem);
					}
					
				}}
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
							onMouseEnter={(e) => {
								selectedIndex.current = updateSelectedItem(filterableRef.current, filteredList, dropdownElements.current, e.currentTarget.tabIndex);
							}}
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
		selectedIndex.current = updateSelectedItem(filterableRef.current, filteredList, dropdownElements.current, selectedIndex.current + 1);
		console.log('Down pressed');
		break;
	case 'ArrowUp':
		e.preventDefault();
		selectedIndex.current = updateSelectedItem(filterableRef.current, filteredList, dropdownElements.current, selectedIndex.current - 1);
		console.log('Up pressed');
		break;
	case 'Enter':
		console.log('Enter Pressed');
		break;
	default:
		console.log('No valid key');
	}
}

function updateSelectedItem(inputRef, filteredList, dropdownElements, desiredIndex) {

	if (filteredList.length <= 0) return -1;

	if (desiredIndex < 0) {
	
		inputRef.focus();
		return -1;
	}
	
	const updatedIndex = clamp(desiredIndex, filteredList.length - 1, 0);

	dropdownElements[updatedIndex].focus();

	return updatedIndex;
}

function clamp(index, upperBound, lowerBound) {

	if (index > upperBound) return upperBound;
	if (index < lowerBound) return lowerBound;
	return index;
}