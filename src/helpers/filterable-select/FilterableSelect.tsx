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

	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const itemRefs = useRef<HTMLDivElement[]>([]);

	const [listItems, setListItems] = useState<FilterableSelectData[]>([]);

	useEffect(() => {

		if (searchTerm.length < 2) {
			setListItems([]);
			return;
		}

		const getData = async () => {

			const data = await queryFn(searchTerm);

			if (data.length === 0) data.push({label: 'No results found...', value: null, subtext: null});

			setListItems(data);
		}

		getData();
		itemRefs.current = itemRefs.current.slice(0, listItems.length);
	}, [searchTerm]);

	useEffect(() => {

		console.log(selectedIndex);
		if (!isOpen) return;
		if (selectedIndex < 0 || selectedIndex > itemRefs.current.length) return;

		itemRefs.current[selectedIndex].scrollIntoView({block: 'nearest'});
	}, [selectedIndex]);

	return (
		<div
			className='filterable-select'
		>
			<input
				type='text'
				name='filterable_select'
				placeholder='Search...'
				onChange={(e) => {
					setSearchTerm(e.target.value)
				}}
				value={ searchTerm }
				onFocus={() => {
					setIsOpen(true)
				}}
				onBlur={() => setIsOpen(false)}
				onKeyDown={(e) => {

					switch (e.key) {
						case 'ArrowDown':
							e.preventDefault();
							console.log('Down pressed');
							setSelectedIndex(clamp(selectedIndex + 1, -1, listItems.length - 1));
							break;
						case 'ArrowUp':
							e.preventDefault();
							console.log('Up pressed');
							setSelectedIndex(clamp(selectedIndex - 1, -1, listItems.length - 1));
							break;
						case 'Enter':
							console.log('Enter Pressed');
							if (selectedIndex < 0 || selectedIndex > itemRefs.current.length) return;
							if (isOpen && listItems[selectedIndex].value !== null) {
								const childItem = listItems[selectedIndex];
								setIsOpen(false);
								setSearchTerm(childItem?.label !== null ? childItem.label : '');
								onSelect(childItem);
							}
							break;
						default:
							setIsOpen(true);
							console.log('Other key');
					}
				}}
			/>
			{isOpen &&
				<div
					className='filterable-dropdown'
				>
					{ listItems.map((item, index) =>
						<FilterableSelectItem
							setRef={(el: HTMLDivElement) => {
								itemRefs.current[index] = el
							}}
							key={ item.value }
							className={`${index === selectedIndex ? 'focused-item' : ''}`}
							tabIndex={ index }
							data={ item }
							setData={ (id) => {
								const childItem = listItems.find((item) => item.value == id);
								const currentSearchTerm = childItem != null && childItem?.label !== null ? childItem.label : '';

								setIsOpen(false);
								setSearchTerm(currentSearchTerm);
								if (childItem != null) onSelect(childItem);
							}}
							onMouseEnter={() => setSelectedIndex(index)}
						/>
					)}
				</div>
			}
		</div>
	);
}

function clamp(
	index: number,
	lowerBound: number,
	upperBound: number
): number {

	if (index > upperBound) return upperBound;
	if (index < lowerBound) return lowerBound;
	return index;
}