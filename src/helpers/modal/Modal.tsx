import './modal.css';
import {ReactNode} from "react";
import {MdOutlineClose} from "react-icons/md";

type ModalProps = {
    children: ReactNode;
}

const Modal = (props: ModalProps) => {

    const {children} = props;

    return (
        <div
            className="modal-background"
        >
            <div
                className="modal-body"
            >
                <MdOutlineClose className='modal-close' size='2em' />
                <div className='modal-content'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;