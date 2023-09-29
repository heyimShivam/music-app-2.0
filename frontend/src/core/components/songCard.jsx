import SongsDataBaseService from "./SongsDataBaseService";

function SongCard(props) {
  const updateCurrentPlayingSongDetails = () => {
    SongsDataBaseService.playingSongDetail = {
      key: String(props.track.hub.actions[0].id),
      image: props.track.images.coverarthq,
      songTitle: props.track.title,
      songAuthorName: props.track.subtitle,
      address: String(props.track.hub.actions[1].uri)
    }
    props.updateFunction();
  }

  return (
    <div className="songCard songCardClickEvent" onClick={updateCurrentPlayingSongDetails}>
      <img src={props.track.images.coverarthq} className="background-image-song-card" alt={props.track.title} />
      <div className="background-image-song-card-two"></div>
      <p className="song-card-name">{props.track.title}</p>
    </div>)
}

export default SongCard;