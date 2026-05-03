import {Button, ProgressBar} from "react-bootstrap";
import {createContext, ReactNode, useContext, useState} from "react";

import './MultistepForm.css';

type MultistepFormProps = {
    title?: string;
    totalStages: number;
    initialStage: number;
    onFinish?: () => Promise<void>;
    children: ReactNode;
}

type StageProps = {
    index: number;
    children: ReactNode;
}

type StageContextType = {
    currentStage: number;
    setCurrentStage: (stage: number) => void;
    totalStages: number;
    onFinish?: () => Promise<void>;
}

const StageContext = createContext<StageContextType>({
    currentStage: 0,
    setCurrentStage: (_stage: number) => {},
    totalStages: 0,
    onFinish: async () => {}
});

const MultistepForm = ({
    title,
    totalStages,
    initialStage,
    onFinish,
    children
}: MultistepFormProps) => {

    const [currentStage, setCurrentStage] = useState<number>(initialStage);

    return (
        <StageContext value={{currentStage, setCurrentStage, totalStages, onFinish}}>
            <div>
                {
                    title ?
                    <Header>{title}</Header> :
                    <></>
                }
                <div
                    className='progress-bar-container'
                >
                    <ProgressBar
                        now={currentStage * 100 / totalStages}
                        label={`${(currentStage * 100 / totalStages).toFixed(0)}%`}
                    />
                </div>
                {children}
            </div>
        </StageContext>
    );
}

const Header = ({children}: Pick<StageProps, 'children'>) => {

    return (
        <div
            className='header-container'
        >
            <h4>{children}</h4>
        </div>
    );
}

const Stage = ({index, children}: StageProps) => {

    const {currentStage} = useContext(StageContext);

    return (
        currentStage === index ?
        <div
            className='stage-container'
        >
            {children}
        </div> :
        <></>
    )
}

const Complete = ({children}: Pick<StageProps, 'children'>) => {

    const {currentStage, totalStages} = useContext(StageContext);

    return (
        currentStage === totalStages ?
        <div
            className='stage-container'
        >
            {children}
        </div> :
        <></>
    );
}

const Controls = () => {

    const {currentStage, setCurrentStage, totalStages, onFinish} = useContext(StageContext);

    return (
        <div
            className='controls-container'
        >
            <Button
                variant='secondary'
                onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                disabled={currentStage === 0 || currentStage === totalStages}
                className='controls-btn'
            >
                Back
            </Button>
            <Button
                variant='primary'
                onClick={async () => {

                    if (currentStage < totalStages) {

                        setCurrentStage(Math.min(totalStages, currentStage + 1))
                    } else {

                        try {

                            if (onFinish !== undefined) await onFinish();

                            setCurrentStage(0);
                        } catch (err) {

                        }
                    }
                }}
                className='controls-btn'
            >
                {currentStage === totalStages ? 'Finish' : 'Next'}
            </Button>
        </div>
    );
}

MultistepForm.Stage = Stage;
MultistepForm.Complete = Complete;
MultistepForm.Controls = Controls;

export default MultistepForm;