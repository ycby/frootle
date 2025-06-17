import {ForwardedRef, forwardRef} from 'react';
import {FilterableSelectData} from "./FilterableSelect.tsx";
import * as React from "react";

interface FilterableSelectItemProps {
	data: FilterableSelectData;
	tabIndex: number;
	setData: (data: string | undefined) => void;
	onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default forwardRef((props:FilterableSelectItemProps, ref: ForwardedRef<any>) => {

	const {
		data,
		tabIndex = 0,
		setData,
		onMouseEnter
	} = props;

	return (
		<div
			ref={ref}
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
});