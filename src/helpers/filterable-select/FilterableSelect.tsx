import {useState, useRef, useEffect} from 'react';
import FilterableSelectItem, {FilterableSelectData} from './FilterableSelectItem';
//import { MdOutlineSearch } from "react-icons/md";

import './FilterableSelect.css'

interface FilterableSelectProps {
	queryFn: (args: string) => Promise<FilterableSelectData[]>,
	onSelect: (value: FilterableSelectData) => void
}

export const FilterableSelect = (props: FilterableSelectProps) => {

	const {
		queryFn,
		onSelect
	} = props;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);

	const filterableRef = useRef<HTMLInputElement | null>(null);
	const dropdownElements = useRef<HTMLDivElement[]>([]);
	const selectedIndex = useRef<number>(-1);

	const [listItems, setListItems] = useState<FilterableSelectData[]>([]);

	useEffect(() => {

		if (searchTerm.length < 2) return;

		const getData = async () => {

			const data = await queryFn(searchTerm);

			if (data.length === 0) data.push({label: 'No results found...', value: null, subtext: null});

			setListItems(data);
		}

		getData();
	}, [searchTerm]);

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
				onFocus={() => {
					setIsOpen(true)
					selectedIndex.current = -1;
				}}
				onBlur={() => setIsOpen(false)}
				onKeyDown={(e) => {
					selectedIndex.current = keyDownController(e, filterableRef.current, listItems, dropdownElements.current, selectedIndex.current)

					//get search key
					if (e.key == 'Enter' && listItems.length != 0) {

						const childItem = listItems[selectedIndex.current];
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
					{ listItems.map((item, index) =>
						<FilterableSelectItem
							key={ item.value }
							tabIndex={ index }
							data={ item }
							setData={ (id) => {
								const childItem = listItems.find((item) => item.value == id);
								const currentSearchTerm = childItem != null && childItem?.label !== null ? childItem.label : '';

								setIsOpen(false);
								setSearchTerm(currentSearchTerm);
								if (childItem != null) onSelect(childItem);
							}}
							onMouseEnter={(e) => {
								selectedIndex.current = updateSelectedItem(filterableRef.current, listItems, dropdownElements.current, selectedIndex.current, e.currentTarget.tabIndex);
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
	filterableRef: HTMLInputElement | null,
	filteredList: FilterableSelectData[],
	dropdownList: HTMLDivElement[],
	selectedIndex: number
): number {

	let returnVal = selectedIndex;
	switch (e.key) {
	case 'ArrowDown':
		e.preventDefault();
		console.log('Down pressed');
		returnVal = updateSelectedItem(filterableRef, filteredList, dropdownList, selectedIndex, selectedIndex + 1);
		break;
	case 'ArrowUp':
		e.preventDefault();
		console.log('Up pressed');
		returnVal = updateSelectedItem(filterableRef, filteredList, dropdownList, selectedIndex, selectedIndex - 1);
		break;
	case 'Enter':
		console.log('Enter Pressed');
		break;
	default:
		console.log('No valid key');
	}

	return returnVal;
}

function updateSelectedItem(
	inputRef: HTMLInputElement | null,
	filteredList: FilterableSelectData[],
	dropdownList: HTMLDivElement[],
	currentIndex: number,
	desiredIndex: number
) {

	if (filteredList.length <= 0) return -1;

	if (desiredIndex < 0) {
	
		if (inputRef !== null) inputRef.focus();
		return -1;
	}

	const newIndex = clamp(desiredIndex, filteredList.length - 1, 0);
	if (currentIndex >= 0 && currentIndex < filteredList.length) dropdownList[currentIndex].classList.remove('focused-item');
	dropdownList[newIndex].classList.add('focused-item');
	dropdownList[newIndex].scrollIntoView({block: 'nearest'});

	return newIndex;
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