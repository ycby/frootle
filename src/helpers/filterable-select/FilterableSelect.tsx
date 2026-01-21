import {useState, useRef, useEffect, useId, ReactElement, CSSProperties} from 'react';
import FilterableSelectItem from './FilterableSelectItem';
//import { MdOutlineSearch } from "react-icons/md";

import {Form} from "react-bootstrap";
import './FilterableSelect.css'

interface FilterableSelectProps<T> {
	queryFn: (args: string) => Promise<T[]>,
	onSelect: (value: T) => void,
	setInputValue: (value: T) => string,
	renderItem: (data: T) => ReactElement,
	initialValue?: string,
	className?: string,
	style?: CSSProperties,
}

const MIN_SEARCH_LEN = 2;

export const FilterableSelect = <T,>(props: FilterableSelectProps<T>) => {

	const {
		queryFn,
		onSelect,
		setInputValue,
		renderItem,
		initialValue,
		className,
		style
	} = props;

	const [searchTerm, setSearchTerm] = useState<string>(initialValue ?? '');
	const [isOpen, setIsOpen] = useState(false);

	const [selectedIndex, setSelectedIndex] = useState<number>(-1);
	const itemRefs = useRef<HTMLDivElement[]>([]);

	const [listItems, setListItems] = useState<T[]>([]);

	const inputId: string = useId();

	useEffect(() => {

		if (searchTerm.length < MIN_SEARCH_LEN) {
			setListItems([]);
			return;
		}

		const getData = async () => {

			const data: T[] = await queryFn(searchTerm);

			setListItems(data);
		}

		getData();
		itemRefs.current = itemRefs.current.slice(0, listItems.length);
	}, [searchTerm]);

	useEffect(() => {

		if (!isOpen) return;
		if (selectedIndex < 0 || selectedIndex > itemRefs.current.length) return;

		itemRefs.current[selectedIndex].scrollIntoView({block: 'nearest'});
	}, [selectedIndex]);

	useEffect(() => {

		setSearchTerm(initialValue ?? '');
	}, [initialValue]);

	return (
		<Form.Group
			controlId={inputId}
			className={`position-relative ${className ?? ''}`}
			style={style}
		>
			<Form.Control
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
							if (isOpen && listItems[selectedIndex] !== null) {
								const childItem = listItems[selectedIndex];
								setIsOpen(false);
								setSearchTerm(setInputValue(childItem));
								onSelect(childItem);
							}
							break;
						default:
							console.log(e.key);
					}
				}}
			/>
			{isOpen && searchTerm.length >= MIN_SEARCH_LEN &&
				<div
					className='filterable-dropdown'
				>
					{ listItems.length > 0 ?
						listItems.map((item: T, index: number) =>
							<FilterableSelectItem
								setRef={(el: HTMLDivElement) => {
									itemRefs.current[index] = el
								}}
								key={ `${inputId}_${index}` }
								className={`${index === selectedIndex ? 'focused-item' : ''}`}
								tabIndex={ index }
								data={ item }
								setData={ (item: T): void => {

									setIsOpen(false);
									setSearchTerm(setInputValue(item));
									if (item != null) onSelect(item);
								}}
								onMouseEnter={() => setSelectedIndex(index)}
							>
								{ renderItem(item) }
							</FilterableSelectItem>
						):
						<div
							className='dropdown-item'
						>
							No results found...
						</div>
					}
				</div>
			}
		</Form.Group>
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