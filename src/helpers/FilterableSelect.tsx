import {useState, useRef, MutableRefObject} from 'react';
import FilterableSelectItem from './FilterableSelectItem.tsx';
//import { MdOutlineSearch } from "react-icons/md";

import './FilterableSelect.css'

interface FilterableSelectProps {
	dataList: FilterableSelectData[],
	onSelect: (value: FilterableSelectData) => void
}

export type FilterableSelectData = {
	label: string | null;
	value: string | null;
	subtext: string | null;
}

export const FilterableSelect = (props: FilterableSelectProps) => {

	const {
		dataList = [],
		onSelect
	} = props;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);

	const filterableRef = useRef<HTMLInputElement | null>(null);
	const dropdownElements = useRef<any>([]);
	const selectedIndex = useRef<number>(-1);

	const filteredList: FilterableSelectData[] = dataList.filter((item: FilterableSelectData) => {

		if (!item.label || !item.subtext) return false;

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
				onFocus={() => setIsOpen(true)}
				onBlur={(e) => {
					if(filterableRef.current !== e.currentTarget) setIsOpen(false);
				}}
				onKeyDown={(e) => {
					keyDownController(e, filterableRef as MutableRefObject<HTMLInputElement>, filteredList, dropdownElements, selectedIndex)

					//get search key
					if (e.key == 'Enter' && filteredList.length != 0) {

						const childItem = filteredList[0];
						setIsOpen(false);
						setSearchTerm(childItem?.label !== null ? childItem.label : '');
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
								const currentSearchTerm = childItem != null && childItem?.label !== null ? childItem.label : '';

								setIsOpen(false);
								setSearchTerm(currentSearchTerm);
								if (childItem != null) onSelect(childItem);
							}}
							onKeyDown={(e) => keyDownController(e, filterableRef as MutableRefObject<HTMLInputElement>, filteredList, dropdownElements, selectedIndex)}
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

//TODO: Clean up this signature
function keyDownController(
	e: React.KeyboardEvent,
	filterableRef: React.MutableRefObject<HTMLInputElement>,
	filteredList: FilterableSelectData[],
	dropdownElements: React.MutableRefObject<HTMLDivElement[]>,
	selectedIndex: React.MutableRefObject<number>
) {

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

function updateSelectedItem(
	inputRef: HTMLInputElement | null,
	filteredList: FilterableSelectData[],
	dropdownElements: HTMLDivElement[],
	desiredIndex: number
) {

	if (filteredList.length <= 0) return -1;

	if (desiredIndex < 0) {
	
		if (inputRef !== null) inputRef.focus();
		return -1;
	}
	
	const updatedIndex = clamp(desiredIndex, filteredList.length - 1, 0);

	dropdownElements[updatedIndex].focus();

	return updatedIndex;
}

function clamp(
	index: number,
	upperBound: number,
	lowerBound: number
) {

	if (index > upperBound) return upperBound;
	if (index < lowerBound) return lowerBound;
	return index;
}