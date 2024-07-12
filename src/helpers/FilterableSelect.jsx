import { useState, useRef } from 'react';
import FilterableSelectItem from './FilterableSelectItem.jsx';
import { MdOutlineSearch } from "react-icons/md";

import './FilterableSelect.css'

export default (props) => {

	const {
		dataList = []
	} = props;

	const [selectedValue, setSelectedValue] = useState({});
	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	const filterableRef = useRef();

	const filteredList = dataList.filter((item) => {
		
		return item.label.toLowerCase().startsWith(searchTerm.toLowerCase()) || item.subtext.toLowerCase().includes(searchTerm.toLowerCase())
	});

	return (
		<div
			ref={ filterableRef }
			className='filterable-select'
			onBlur={(e) => setIsOpen(false)}
		>
			<input
				ref={ filterableRef }
				type='text'
				name='filterable_select'
				placeholder='Search...'
				onChange={(e) => setSearchTerm(e.target.value)}
				value={ searchTerm }
				onFocus={(e) => setIsOpen(true)}
			/>
			{isOpen &&
				<div
					className='filterable-dropdown'
				>
					{ filteredList.map((item) =>
						<FilterableSelectItem
							key={ item.value }
							data={ item }
							setData={ (id) => {
								const childItem = filteredList.find((item) => item.value == id);
								setSelectedValue(childItem);
								setIsOpen(false);
								setSearchTerm(childItem.label);
							}} 
						/>
					)}
				</div>
			}
		</div>
	);
}