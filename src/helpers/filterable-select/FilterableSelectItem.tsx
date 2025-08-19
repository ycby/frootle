import * as React from "react";

export interface FilterableSelectData {
	label: string | null;
	value: string | null;
	subtext: string | null;
}

interface FilterableSelectItemProps {
	data: FilterableSelectData;
	tabIndex: number;
	setData: (data: string | undefined) => void;
	onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FilterableSelectItem = (props:FilterableSelectItemProps) => {

	const {
		data,
		tabIndex = 0,
		setData,
		onMouseEnter
	} = props;

	return (
		<div
			data-value={ data.value }
			tabIndex={ tabIndex }
			className='dropdown-item'
			role='listitem'
			onMouseDown={ (e) => setData(e.currentTarget?.dataset?.value) }
			onMouseEnter={ (e) => {

				onMouseEnter(e);
			}}
		>
			<span className='main-text'>{ data.label }</span>
			<span className='sub-text'>{ data.subtext }</span>
		</div>
	);
}

export default FilterableSelectItem;