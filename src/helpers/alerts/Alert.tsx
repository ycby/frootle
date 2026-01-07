import {useAlert} from "#root/src/helpers/alerts/AlertContext.js";
import {Alert, Stack} from "react-bootstrap";

const AlertContainer = () => {

    const {alerts, removeAlert} = useAlert();

    return (
        <Stack
            className='position-absolute d-flex align-items-center start-0 end-0 container pt-2'
            gap={2}
        >
            {alerts.map((alert, index: number) => (
                <Alert
                    key={`${alert.name}_${index}`}
                    className='col-12 col-sm-8 col-xl-6 z-3'
                    variant={alert.type}
                    onClose={() => removeAlert(index)}
                    dismissible
                >
                    {alert?.name && <Alert.Heading>{alert.name}</Alert.Heading>}
                    <span>
                        {alert.message}
                    </span>
                </Alert>
            ))}
        </Stack>
    );
}

export {
    AlertContainer,
}