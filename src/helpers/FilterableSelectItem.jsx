import { useState } from 'react';

export default (props) => {

	const {
		data,
		setData
	} = props;

	return (
		<div
			data-value={ data.value }
			className='dropdown-item'
			onMouseDown={ (e) => setData(e.currentTarget.dataset.value) }
		>
			<span className='main-text'>{ data.label }</span>
			<span className='sub-text'>{ data.subtext }</span>
		</div>
	);
}