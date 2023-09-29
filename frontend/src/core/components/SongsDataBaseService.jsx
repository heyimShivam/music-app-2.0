import {LoginServiceData} from "./loginService";

const backendUrl = 'http://localhost:8000';

const shazamApiKey = 'b59b9311e8msh1d91f1d554612d1p1a25afjsn7c22fdbab884';
// const shazamApiKey = "none";

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': shazamApiKey,
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
    }
};

const SongsDataBaseService = {
    playingSongDetail: {
        key: '',
        image: '',
        songTitle: '',
        songAuthorName: '',
        address: '',
    },
    favouritiesSongsKey: [],
    favouritiesSongsAllData: [],
    playListDataBackend: [],
    searchSongAndGetData: async (songName) => {
        let response = await fetch('https://shazam.p.rapidapi.com/search?term=' + songName + '&locale=en-US&offset=0&limit=5', options);
        return response;
    },
    setPlaylistData: async() => {
        console.log("main Function: SongsDataBaseService.setPlaylistData");
        console.log(SongsDataBaseService.playListDataBackend);

        const requestData = {
            userEmail: LoginServiceData.userEmail,
            updateData: {
                playListData: SongsDataBaseService.playListDataBackend
            }
        }
        
        console.log("requestData + setPlaylistData");
        console.log(requestData);
        console.log(SongsDataBaseService.playListDataBackend);

        await fetch(backendUrl + '/update', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData),
        }).then((res) => {}).catch(error => {
            console.error(error);
        } );
    },
    getPlaylistData: () => {
        return SongsDataBaseService.playListDataBackend;
    },
    saveFavSongToLocalstorage: async() => {
        const requestData = {
            userEmail: LoginServiceData.userEmail,
            updateData: {
                favSongs: SongsDataBaseService.favouritiesSongsKey
            }
        }
        await fetch(backendUrl + '/update', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData),
        }).then((res) => {}).catch(error => {
            console.error(error);
        } );
    },
    getFavSongsDataFromBackend: async () => {
        if (SongsDataBaseService.favouritiesSongsKey) {
            const FavSongsAllData = [];

            for (let i = 0; i <= SongsDataBaseService.favouritiesSongsKey.length; i++) {
                await fetch('https://shazam.p.rapidapi.com/songs/v2/get-details?id=' + SongsDataBaseService.favouritiesSongsKey[i] + '&l=en-US', options)
                    .then(response => response.json())
                    .then(response => {
                        FavSongsAllData.push(response);
                        (SongsDataBaseService.favouritiesSongsAllData) = FavSongsAllData;
                    })
                    .catch(err => console.error(err));
            }

            return Promise.resolve(FavSongsAllData);
        }
    },
    getPlayListSongsDetailsBackend: async () => {
        const playlistData = [];

        if (!SongsDataBaseService.getPlaylistData()) {
            return Promise.reject([]);
        }

        for (let i = 0; i < SongsDataBaseService.getPlaylistData().length; i++) {
            playlistData.push({
                playlistName: SongsDataBaseService.getPlaylistData()[i].name,
                playlistSongData: []
            });

            for (let j = 0; j < SongsDataBaseService.getPlaylistData()[i].tracksIds.length; j++) {
                await fetch('https://shazam.p.rapidapi.com/songs/v2/get-details?id=' + SongsDataBaseService.getPlaylistData()[i].tracksIds[j] + '&l=en-US', options)
                    .then(response => response.json())
                    .then(response => {
                        playlistData[i].playlistSongData.push(response);
                    })
                    .catch(err => console.error(err));
            }
        }

        return Promise.resolve(playlistData);
    },
    getAllSongsData: async (startFrom) => {
        var response = await fetch('https://shazam.p.rapidapi.com/charts/track?locale=en-US&pageSize=15&startFrom=' + startFrom, options)
        return response;
    }
};

export default SongsDataBaseService;