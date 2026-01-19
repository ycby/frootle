import {ReactElement} from "react";

interface FilterableSelectItemProps<T> {
	setRef: (element: HTMLDivElement) => void;
	data: T;
	tabIndex: number;
	className?: string;
	setData: (data: T) => void;
	onMouseEnter: () => void;
	children?: ReactElement;
}

const FilterableSelectItem = <T,>(props:FilterableSelectItemProps<T>) => {

	const {
		setRef,
		data,
		tabIndex = 0,
		className = '',
		setData,
		onMouseEnter,
		children
	} = props;

	return (
		<div
			ref={setRef}
			tabIndex={ tabIndex }
			className={`dropdown-item ${className}`}
			role='listitem'
			onMouseDown={ () => setData(data) }
			onMouseEnter={ () => onMouseEnter() }
		>
			{children}
		</div>
	);
}

export default FilterableSelectItem;