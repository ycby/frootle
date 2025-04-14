import {ForwardedRef, forwardRef} from 'react';
import {FilterableSelectData} from "./FilterableSelect.tsx";

interface FilterableSelectItemProps {
	data: FilterableSelectData;
	tabIndex: number;
	setData: (data: string | undefined) => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default forwardRef((props:FilterableSelectItemProps, ref: ForwardedRef<any>) => {

	const {
		data,
		tabIndex = 0,
		setData,
		onKeyDown,
		onMouseEnter
	} = props;

	return (
		<div
			ref={ref}
			data-value={ data.value }
			tabIndex={ tabIndex }
			className='dropdown-item'
			onMouseDown={ (e) => setData(e.currentTarget?.dataset?.value) }
			onKeyDown={ (e) => {
				onKeyDown(e)

				if (e.key == 'Enter') setData(e.currentTarget.dataset.value);
			}}
			onMouseEnter={ onMouseEnter }
		>
			<span className='main-text'>{ data.label }</span>
			<span className='sub-text'>{ data.subtext }</span>
		</div>
	);
});