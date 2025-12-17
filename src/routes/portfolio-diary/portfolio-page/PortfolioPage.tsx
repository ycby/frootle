import Container from 'react-bootstrap/Container';
import {useParams} from "react-router-dom";

const PortfolioPage = () => {

    let params = useParams();

    return (
        <Container fluid>
            Hi, Portfolio Page - {params.id}
        </Container>
    );
}

export {
    PortfolioPage
}