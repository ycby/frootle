import {DiaryEntryListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";

import './DiaryEntry.css';

interface DiaryEntryProps {
    entry: DiaryEntryListItem
}

const DiaryEntry = (props: DiaryEntryProps) => {

    const {
        entry
    } = props;

    return (
        <div key={entry.id} className='diary-entry__container'>
            <h3 className='diary-entry__header'>{entry.title}</h3>
            <div className='diary-entry__content'>
                {entry.content}
            </div>
        </div>
    );
}

export default DiaryEntry;