import './Button.css';
import * as React from "react";

type ButtonProps = {
    onClick: (event: React.MouseEvent) => void;
    children: React.ReactNode;
}

const Button = (props: ButtonProps) => {

    const {
        onClick,
        children
    } = props;

    return (
        <div
            className='button'
            onClick={onClick}
        >
            {children}
        </div>
    );
}

export default Button;