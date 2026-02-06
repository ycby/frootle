import {useEffect} from "react";
import {Alert} from "react-bootstrap";
import {AlertContent, useAlert} from "#root/src/helpers/alerts/AlertContext.tsx";

const GlobalAlert = (props: AlertContent & {index: number}) => {

    const {
        name,
        message = 'Default message',
        type = 'info',
        duration = 0,
        index
    } = props

    const {removeAlert} = useAlert();

    useEffect(() => {

        if (duration <= 0) return;

        const alertTimer = setTimeout(() => removeAlert(index), duration);
        return () => clearTimeout(alertTimer);
    }, []);

    return (
        <Alert
            className='col-12 col-sm-8 col-xl-6 z-3'
            variant={type}
            onClose={() => removeAlert(index)}
            dismissible
        >
            {name && <Alert.Heading>{name}</Alert.Heading>}
            <span>
                {message}
            </span>
        </Alert>
    );
}

export {
    GlobalAlert
}