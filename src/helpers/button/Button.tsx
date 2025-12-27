import './Button.css';
import * as React from "react";

type ButtonProps = {
    style?: React.CSSProperties;
    onClick: (event: React.MouseEvent) => void;
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {

    const {
        style,
        onClick,
        children
    } = props;

    return (
        <div
            className='button'
            style={style}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Button;