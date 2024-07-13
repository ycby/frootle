import { forwardRef } from 'react';

export default forwardRef((props, ref) => {

	const {
		data,
		tabIndex = 0,
		setData,
		onKeyDown
	} = props;

	return (
		<div
			ref={ref}
			data-value={ data.value }
			tabIndex={ tabIndex }
			className='dropdown-item'
			onMouseDown={ (e) => setData(e.currentTarget.dataset.value) }
			onKeyDown={ onKeyDown }
		>
			<span className='main-text'>{ data.label }</span>
			<span className='sub-text'>{ data.subtext }</span>
		</div>
	);
});