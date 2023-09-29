import { useState } from "react";
import SongsDataBaseService from "./components/SongsDataBaseService";

function Search(props) {
    const [loader, setLoader] = useState(false);
    const [searchAbleSong, setSearchAbleSong] = useState('');
    const [isSearching, setIsSearching] = useState(true);
    const [searchResult, setSearchResult] = useState({});


    const handleChange = (event) => {
        setSearchAbleSong(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setLoader(true);

            SongsDataBaseService.searchSongAndGetData(searchAbleSong)
                .then(response => response.json())
                .then(response => {
                    setSearchResult(response);
                    setIsSearching(false);
                    setLoader(false);
                })
                .catch(err => console.error(err));
        }
    };

    function updateCurrentPlayingSongDetails(value = 0) {
        SongsDataBaseService.playingSongDetail = {
            key: String(searchResult.tracks.hits[value].track.hub.actions[0].id),
            image: (searchResult.tracks.hits[value].track.images.coverart),
            songTitle: searchResult.tracks.hits[value].track.title,
            songAuthorName: searchResult.tracks.hits[value].track.subtitle,
            address: String(searchResult.tracks.hits[value].track.hub.actions[1].uri)
        }

        props.updateFunction();
    }

    return (<>
        <div className="container">
            <div className="searchInputWrapper">
                <input className="searchInput" value={searchAbleSong} onChange={handleChange} type="text" placeholder='Search song here....' onKeyDown={handleKeyDown}>
                </input>
                <i className="searchInputIcon bi bi-search"></i>
            </div>
        </div>
        <div className="container-fluid search-container">
            {loader ? <><div className="loader"></div></> : <></>}
            {isSearching ?
                <></> :
                <>
                    <div className="songByListContainer">
                        <div className="headingBlock d-flex">
                            <p className="headingSongsContainer">Result of the Search</p>
                            <div className="hrHeading">
                                <hr className='shivam' />
                            </div>
                        </div>
                    </div>

                    {searchResult.tracks ? <>
                        {
                            searchResult.tracks.hits.map((value, index) => {
                                return (<div key={index}>
                                    <div className="box">
                                        <div className="songCard songCardViewUpdatedWidth favSongsCoard songCardClickEvent" onClick={() => { updateCurrentPlayingSongDetails(index) }}>
                                            {value.track ? <>
                                                <img src={value.track.images.coverart} className="background-image-song-card" alt={value.track.title} />
                                                <div className="background-image-song-card-two"></div>
                                                <p className="song-card-name">{value.track.title}</p>
                                            </> : <></>}
                                        </div>
                                    </div>
                                </div>)
                            })
                        }
                    </>
                        : <>
                            <div className="songByListContainer">
                                <div className="headingBlock d-flex">
                                    <p className="headingSongsContainer headingSongsContainerchanges">( No Track Found. Please Try Again After Some Time May be network issue. )</p>
                                </div>
                            </div>
                        </>}
                </>}
        </div>
    </>)
}

export default Search;