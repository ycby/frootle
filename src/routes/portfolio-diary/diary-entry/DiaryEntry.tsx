import {DiaryEntryListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";

import './DiaryEntry.css';
import {ReactElement} from "react";
import {ComponentStatus} from "#root/src/types.ts";
import Button from "#root/src/helpers/button/Button.tsx";

interface DiaryEntryProps {
    entry: DiaryEntryListItem,
    editView: ReactElement,
    onEdit: (index: number) => void,
    onDelete: (index: number) => void,
    onBack: (index: number) => void,
}

const DiaryEntry = (props: DiaryEntryProps) => {

    const {
        entry,
        editView,
        onEdit,
        onDelete,
        onBack
    } = props;

    return (
        diaryEntryView(entry, editView, onEdit, onDelete, onBack)
    );
}

const diaryEntryView = (entry: DiaryEntryListItem, editView: ReactElement, onEdit: (index: number) => void, onDelete: (index: number) => void, onBack: (index: number) => void) => {

    switch(entry.status) {
        case ComponentStatus.VIEW:
            return (
                <div key={entry.id} className='diary-entry__container'>
                    <h3 className='diary-entry__header'>{entry.title}</h3>
                    <div className='diary-entry__content'>
                        {entry.content}
                    </div>
                </div>
            );
        case ComponentStatus.EDIT:
            return(
                <div key={entry.id} className='diary-entry__container'>
                    {editView}
                    <div className='diary-entry__button-container'>
                        <Button
                            onClick={() => onBack(entry.index)}
                        >Back</Button>
                        <Button
                            onClick={() => onEdit(entry.index)}
                        >Save</Button>
                    </div>
                </div>
            );
        case ComponentStatus.DELETE:
            return (
                <div key={entry.id} className='diary-entry__container'>
                    <div>
                        Are you sure?
                    </div>
                    <div className='transaction-component__button-container'>
                        <Button
                            onClick={() => onBack(entry.index)}
                        >Back</Button>
                        <Button
                            onClick={() => onDelete(entry.index)}
                        >Delete</Button>
                    </div>
                </div>
            );
        default:
            return (
                <div>
                    Unknown Status... An error occurred in the component
                </div>
            );
    }
}

export default DiaryEntry;