import {Button, ProgressBar} from "react-bootstrap";
import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState, RefObject} from "react";

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
    validation?: null | (() => boolean);
    onNext?: null | (() => void);
    children: ReactNode;
}

type StageContextType = {
    currentStage: number;
    setCurrentStage: (stage: number) => void;
    totalStages: number;
    onFinish?: () => Promise<void>;
    validations: RefObject<MultistepValidation>,
    registerValidation: (key: number, fn: (() => boolean) | null) => void,
    onNextFunctions: RefObject<MultistepOnNext>,
    registerOnNext: (key: number, fn: (() => void) | null) => void
}

type MultistepValidation = {
    [key: number]: null | (() => boolean);
}

type MultistepOnNext = {
    [key: number]: null | (() => void);
}

const StageContext = createContext<StageContextType>({
    currentStage: 0,
    setCurrentStage: (_stage: number) => {},
    totalStages: 0,
    onFinish: async () => {},
    validations: {current: {}},
    registerValidation: (_key: number, _fn: (() => boolean) | null) => {},
    onNextFunctions: {current: {}},
    registerOnNext: (_key: number, _fn: (() => void) | null) => {}
});

const MultistepForm = ({
    title,
    totalStages,
    initialStage,
    onFinish,
    children
}: MultistepFormProps) => {

    const [currentStage, setCurrentStage] = useState<number>(initialStage);

    const validations = useRef<MultistepValidation>({});
    const onNextFunctions = useRef<MultistepOnNext>({});

    const registerValidation = useCallback((key: number, fn: (() => boolean) | null) => {

        validations.current[key] = fn;
    }, [children]);

    const registerOnNext = useCallback((key: number, fn: (() => void) | null) => {

        onNextFunctions.current[key] = fn;
    }, [children]);

    return (
        <StageContext
            value={{
                currentStage,
                setCurrentStage,
                totalStages,
                onFinish,
                validations,
                registerValidation,
                onNextFunctions,
                registerOnNext
            }}
        >
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

const Stage = ({index, validation = null, onNext = null, children}: StageProps) => {

    const {currentStage, registerValidation, registerOnNext} = useContext(StageContext);

    const validationRef = useRef(validation);
    const onNextRef = useRef(onNext);

    useEffect(() => {

        validationRef.current = validation ?? (() => true);
        onNextRef.current = onNext;
    });

    useEffect(() => {

        const stableValidationRef = () => validationRef.current?.() ?? false;

        registerValidation(index, stableValidationRef);

        return (() => registerValidation(index, null));
    }, [index, validation]);

    useEffect(() => {

        const stableOnNextRef = () => onNextRef.current?.() ?? false;

        registerOnNext(index, stableOnNextRef);

        return (() => registerOnNext(index, null));
    }, [index, onNext]);

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

    const {currentStage, setCurrentStage, totalStages, onFinish, validations, onNextFunctions} = useContext(StageContext);

    const currentValidation = validations.current[currentStage] ?? null;
    const currentOnNext = onNextFunctions.current[currentStage] ?? null;

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

                    if (currentValidation !== null && !currentValidation()) return;
                    if (currentOnNext !== null) currentOnNext();

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