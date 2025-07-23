import {useId} from "react";
import {DiaryEntryData} from "#root/src/routes/portfolio-diary/types.ts";
import {NewItemView} from "#root/src/types.ts";

import './NewDiaryEntry.css';

const NewDiaryEntry = (props: NewItemView<DiaryEntryData>) => {

    const {
        sourceObject,
        updateSource
    } = props;

    const titleId = useId();
    const contentId = useId();

    return (
        <div className='new-diary-entry__container'>
            <input
                className='new-diary-entry__input new-diary-entry__title'
                type='text'
                id={titleId}
                name='title'
                placeholder='Title'
                value={sourceObject.title}
                onChange={(e) => {
                    updateSource({...sourceObject, title: e.target.value});
                }}
            />
            <textarea
                className='new-diary-entry__input'
                id={contentId}
                name='content'
                placeholder={`What's the update?`}
                rows={8}
                value={sourceObject.content}
                onChange={(e) => {
                    updateSource({...sourceObject, content: e.target.value});
                }}
            />
        </div>
    );
}

export default NewDiaryEntry;