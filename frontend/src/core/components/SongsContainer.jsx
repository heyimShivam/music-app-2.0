import { useEffect, useState } from "react";
import SongsDataBaseService from './SongsDataBaseService';

import SongCard from "./songCard";


function SongsContainer(props) {
    const [loaderForRelease, setLoaderForRelease] = useState(true);
    const [loaderForFeatured, setLoaderForFeatured] = useState(true);

    function updateFunctionSongContainer() {
        props.updateFunction();
    }

    const [songsData, setSongsData] = useState({});
    const [featuredSongsData, setFeaturedSongsData] = useState({});

    const fetchSongsData = (startingValue = '0') => {
        SongsDataBaseService.getAllSongsData(startingValue).then(response => response.json())
            .then(response => {
                setSongsData(response);
                setLoaderForRelease(false);
            })
            .catch(err => {
                console.error(err)
            });
    }

    const fetchFeaturedSongsData = (startingValue= '5') => {
        SongsDataBaseService.getAllSongsData(startingValue).then(response => response.json())
            .then(response => {
                setFeaturedSongsData(response);
                setLoaderForFeatured(false);
            })
            .catch(err => {
                console.error(err)
            });
    }

    useEffect(() => {
        fetchSongsData();
        fetchFeaturedSongsData();
    }, [])

    return (<div className="bottom-padding-to-div">
        <div className="container-fluid">
            <div className="songByListContainer">
                <div className="headingBlock d-flex">
                    <p className="headingSongsContainer">Released This Week</p>
                    <div className="hrHeading">
                        <hr className='shivam' />
                    </div>
                </div>
                {loaderForRelease ? <div className="loader"></div> : <></>}
                {songsData.tracks ? <>
                    <div className="container-fluid">
                        <div className="songCardViewRow">
                            {
                                songsData.tracks.map((value, index) => {
                                    return (<div key={index}>
                                        <div className="songCardView">
                                            <SongCard track={value} updateFunction={updateFunctionSongContainer} />
                                        </div>
                                    </div>)
                                })
                            }
                        </div>
                    </div>
                </> : <></>}
            </div>
            <div className="headingBlock d-flex">
                <p className="headingSongsContainer">Featured Playlist</p>
                <div className="hrHeading">
                    <hr className='shivam' />
                </div>
            </div>
            {loaderForFeatured ? <div className="loader"></div> : <></>}
            {featuredSongsData.tracks ? <>
                <div className="container-fluid">
                    <div className="songCardViewRow">
                        {
                            featuredSongsData.tracks.map((value, index) => {
                                return (<div key={index}>
                                    <div className="songCardView">
                                        <SongCard track={value} updateFunction={updateFunctionSongContainer} />
                                    </div>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </> : <></>}
            <div className="headingBlock d-flex">
                <p className="headingSongsContainer">New to me</p>
                <div className="hrHeading">
                    <hr className='shivam' />
                </div>
            </div>
            {loaderForFeatured ? <div className="loader"></div> : <></>}
            {featuredSongsData.tracks ? <>
                <div className="container-fluid">
                    <div className="songCardViewRow">
                        {
                            featuredSongsData.tracks.map((value, index) => {
                                return (<div key={index}>
                                    <div className="songCardView">
                                        <SongCard track={value} updateFunction={updateFunctionSongContainer} />
                                    </div>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </> : <></>}

        </div>
    </div>)
}
export default SongsContainer;
