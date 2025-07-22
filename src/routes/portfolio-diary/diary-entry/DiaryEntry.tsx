import {DiaryEntryListItem} from "#root/src/routes/portfolio-diary/PortfolioDiary.tsx";

import './DiaryEntry.css';

interface DiaryEntryProps {
    index: number;
    entry: DiaryEntryListItem
}

const DiaryEntry = (props: DiaryEntryProps) => {

    const {
        index,
        entry
    } = props;

    return (
        <div key={entry.id} className='diary-entry__container'>
            <h3 style={{margin: '0'}}>#{index + 1}</h3>
            <div className='diary-entry__content'>
                {entry.content}
            </div>
        </div>
    );
}

export default DiaryEntry;