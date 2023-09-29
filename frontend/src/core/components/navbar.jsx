import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
    const [active, setActive] = useState('home')
    return (
        <>
            <div className="container navbarContainer">
                <ul>
                    <li>
                        <Link className={`linkstyle ${active === 'home' && 'active'}`} onClick={() => setActive('home')} to="/">
                            <i className="bi bi-house"></i> Home
                        </Link>
                    </li>
                    <li>
                        <Link className={`linkstyle ${active === 'search' && 'active'}`} onClick={() => setActive('search')} to="/search">
                            <i className="bi bi-search"></i> Search
                        </Link>
                    </li>
                    <li>
                        <Link className={`linkstyle ${active === 'favourities' && 'active'}`} onClick={() => setActive('favourities')} to="/favourities">
                            <i className="bi bi-heart"></i>Favourities
                        </Link>
                    </li>
                    <li>
                        <Link className={`linkstyle ${active === 'playlists' && 'active'}`} onClick={() => setActive('playlists')} to="/playlists">
                            <i className="bi bi-music-note-list"></i> Playlists
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )

}

export default Navbar;