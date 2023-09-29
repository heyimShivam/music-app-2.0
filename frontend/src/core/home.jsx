import HeaderHomePage from './components/HeaderHomePage';
import SongsContainer from './components/SongsContainer';

function Home(props) {
    function updateFunction() {
        props.updateFunction();
    }

    return (
        <>
            <HeaderHomePage />
            <SongsContainer updateFunction={updateFunction} />
        </>);
}
export default Home;