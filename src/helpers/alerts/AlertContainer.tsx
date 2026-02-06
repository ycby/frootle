import {useAlert} from "#root/src/helpers/alerts/AlertContext.js";
import {Stack} from "react-bootstrap";
import {GlobalAlert} from "#root/src/helpers/alerts/GlobalAlert.tsx";

const AlertContainer = () => {

    const {alerts} = useAlert();

    return (
        <Stack
            className='position-absolute d-flex align-items-center start-0 end-0 container pt-2'
            gap={2}
        >
            {alerts.map((alert, index: number) => <GlobalAlert
                key={`g_alert_${index}`}
                name={alert.name}
                message={alert.message}
                type={alert.type}
                duration={alert.duration}
                index={index}
            />)}
        </Stack>
    );
}

export {
    AlertContainer,
}