import {ReactElement} from "react";

interface TabProps {
    title: string,
    children: ReactElement
}

const Tab: (props: TabProps) => ReactElement = (props: TabProps): ReactElement => {

    const {
        title,
        children
    } = props;

    return (
        <div>
            <div>
                {children}
            </div>
        </div>
    );
}

export default Tab;