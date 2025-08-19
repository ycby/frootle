import * as React from "react";

export interface FilterableSelectData {
	label: string | null;
	value: string | null;
	subtext: string | null;
}

interface FilterableSelectItemProps {
	setRef: (element: HTMLDivElement) => void;
	data: FilterableSelectData;
	tabIndex: number;
	className?: string;
	setData: (data: string | undefined) => void;
	onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FilterableSelectItem = (props:FilterableSelectItemProps) => {

	const {
		setRef,
		data,
		tabIndex = 0,
		className = '',
		setData,
		onMouseEnter
	} = props;

	return (
		<div
			ref={setRef}
			data-value={ data.value }
			tabIndex={ tabIndex }
			className={`dropdown-item ${className}`}
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