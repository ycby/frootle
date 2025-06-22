import './Section.css';
import Loading from "#root/src/helpers/loading/Loading.tsx";

type SectionContainerProps = {
    items: SectionContainerItems[];
}
type SectionContainerItems = {
    name: string;
    id: string;
}

const SectionContainer = (props: SectionContainerProps) => {

    return (
        <div className='section-container'>
            <div className='section-container__sidebar'>
                <ul>
                    {generateSidebarItems(props.items)}
                </ul>
            </div>
            <div className='section-container__content'>
                <Loading />
            </div>
        </div>
    );
}

const generateSidebarItems = (sections: SectionContainerItems[]) => {

    return sections.map(section => {

        return (
            <li key={section.id}>
                {section.name}
            </li>
        )
    });
}

export default SectionContainer;