import { useState, useEffect } from "react";
import SongsDataBaseService from "./components/SongsDataBaseService";
import { RootObjectFav } from "./favType";

function Playlists(props) {
    const [playListData, setPlayListData] = useState([]);
    const [loader, setLoader] = useState(true);

    function updateCurrentPlayingSongDetails(value = 0, mainIndex = 0) {
        SongsDataBaseService.playingSongDetail = {
            key: String(playListData[mainIndex].playlistSongData[value].data[0].id),
            image: (playListData[mainIndex].playlistSongData[value].data[0].attributes.artwork.url).replace('{w}x{h}', '400x400'),
            songTitle: playListData[mainIndex].playlistSongData[value].data[0].attributes.albumName,
            songAuthorName: playListData[mainIndex].playlistSongData[value].data[0].attributes.artistName,
            address: String(playListData[mainIndex].playlistSongData[value].data[0].attributes.previews[0].url)
        }

        props.updateFunction();
    }

    useEffect(() => {
        SongsDataBaseService.getPlayListSongsDetailsBackend().then((value) => {
            // unknown is used here because there is no direct api to fetch user playlist directly
            // so take make playlist fetch i have customized the calling part so that user can make playlist
            // in order to achieve this i have used unknown here. 
            setPlayListData(value);
            setLoader(false);
        })
    }, []);

    return (
        <>
            {
                loader ?
                    <>
                        <div className="loader"></div>
                    </> :
                    <div className="container-fluid">
                        {playListData ? <>
                            {
                                playListData.map((value, mainIndex) => {
                                    return (<div key={mainIndex}>
                                        <div className="playlist">
                                            <div className="songByListContainer">
                                                <div className="headingBlock d-flex">
                                                    <p className="headingSongsContainer">{value.playlistName}</p>
                                                    <div className="hrHeading">
                                                        <hr className='shivam' />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="songCardViewRow">
                                            {value.playlistSongData ? <>
                                                {
                                                    value.playlistSongData.map((trackData, index) => {
                                                        return (<div key={index}>
                                                            <div className="songCardView songCardViewUpdatedWidth">
                                                                <div className="songCard songCardClickEvent" onClick={() => { updateCurrentPlayingSongDetails(index, mainIndex) }}>
                                                                    {trackData.data ? <>
                                                                        <img src={(trackData.data[0].attributes.artwork.url).replace('{w}x{h}', '400x400')} className="background-image-song-card" alt={trackData.data[0].attributes.albumName} />
                                                                        <div className="background-image-song-card-two"></div>
                                                                        <p className="song-card-name">{trackData.data[0].attributes.albumName}</p>
                                                                    </> : <></>}
                                                                </div>
                                                            </div>
                                                        </div>)
                                                    })
                                                }
                                            </> : <>
                                                Network Error please try again after some time !!!
                                            </>}
                                        </div>
                                    </div>)

                                })
                            }
                        </> : <></>}
                    </div>}
        </>
    )
}
export default Playlists;