import './PortfolioDiary.css';
import SectionContainer from "#root/src/helpers/section-container/SectionContainer.tsx";

const exampleStocks = [
    {
        name: 'Stock 1',
        id: '00001'
    },
    {
        name: 'Stock 2',
        id: '00002'
    },
    {
        name: 'Stock 3',
        id: '00003'
    }
]

const PortfolioDiary = () => {

    return (
        <div id="portfolio-diary">
            <h1>Portfolio Diary</h1>
            <div style={{
                width: '100%',
                height: '100%',
                padding: '0 0 80px'
            }}>
                <SectionContainer items={exampleStocks}></SectionContainer>
            </div>
        </div>
    );
}

export {
    PortfolioDiary
}