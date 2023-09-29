
import { useState, useEffect } from "react";
import { RootObjectFav } from "./favType";
import SongsDataBaseService from "./components/SongsDataBaseService";

function Favourities(props) {
    const [loader, setLoader] = useState(true);
    let [favouritiesSongsAllData, setFavouritiesSongsAllData] = useState([]);

    useEffect(() => {
        SongsDataBaseService.getFavSongsDataFromBackend().then((res) => {
            setFavouritiesSongsAllData(res);
            setLoader(false);
        });
    }, []);

    function updateCurrentPlayingSongDetails(value = 0) {
        SongsDataBaseService.playingSongDetail = {
            key: String(favouritiesSongsAllData[value].data[0].id),
            image: (favouritiesSongsAllData[value].data[0].attributes.artwork.url).replace('{w}x{h}', '400x400'),
            songTitle: favouritiesSongsAllData[value].data[0].attributes.albumName,
            songAuthorName: favouritiesSongsAllData[value].data[0].attributes.artistName,
            address: String(favouritiesSongsAllData[value].data[0].attributes.previews[0].url)
        }

        props.updateFunction();
    }

    return (<>
        <div className="container">
            {loader ? <><div className="loader"></div></> : <></>}
            {favouritiesSongsAllData ? <>
                {
                    favouritiesSongsAllData.map((value, index) => {
                        return (<div key={index}>
                            <div className="box ">
                                <div className="songCard songCardViewUpdatedWidth favSongsCoard songCardClickEvent" onClick={() => { updateCurrentPlayingSongDetails(index) }}>
                                    {value.data ? <>
                                        <img src={(value.data[0].attributes.artwork.url).replace('{w}x{h}', '400x400')} className="background-image-song-card" alt={value.data[0].attributes.albumName} />
                                        <div className="background-image-song-card-two"></div>
                                        <p className="song-card-name">{value.data[0].attributes.albumName}</p>
                                    </> : <></>}
                                </div>
                            </div>
                        </div>)
                    })
                }
            </> : <></>}
        </div>
    </>)
}
export default Favourities;