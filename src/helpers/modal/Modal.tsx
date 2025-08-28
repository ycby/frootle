import './modal.css';
import {ReactNode} from "react";
import {MdOutlineClose} from "react-icons/md";

type ModalProps = {
    children: ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Modal = (props: ModalProps) => {

    const {
        children,
        isOpen,
        setIsOpen,
    } = props;

    return (
        <div
            className={`modal-background ${isOpen ? 'modal-open' : 'modal-close'}`}
        >
            <div
                className="modal-body"
            >
                <MdOutlineClose
                    className='modal-close-icon'
                    size='2em'
                    onClick={() => {
                        setIsOpen(false);
                    }}
                />
                <div className='modal-content'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;