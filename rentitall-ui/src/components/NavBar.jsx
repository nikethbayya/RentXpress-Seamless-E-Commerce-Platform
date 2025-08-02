import { useCallback, useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import './../styles/NavBar.css'
import { useUser } from '../hooks/UserContext';
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useVoice } from '../hooks/useVoice';
import CloseIcon from '@mui/icons-material/Close';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const NavBar = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const { loginData, logOutUser, user } = useUser();
    const [searchInput, setSearchInput] = useState({
        value: '',
        voice: false
    })
    const [showProfileDropDown, setShowProfileDropDown] = useState(false)
    useEffect(() => {
        if (searchInput.voice) {
            handleSearch()
        }
    }, [searchInput])
    const handleSearch = useCallback(async () => {
        // console.log('search clicked!!!')

        const phrase = searchInput.value.trim()
        if (phrase.length == 0) return

        if (location.pathname == '/results') {
            searchParams.set('phrase', phrase)
        }
        navigate(`/results?phrase=${phrase}`)
    })

    // Voice Search
    const {
        text,
        isListening,
        listen,
        voiceSupported,
    } = useVoice(handleSearch);

    useEffect(() => {
        setSearchInput({
            value: text,
            voice: true
        })
    }, [text])

    const toggleProfileDropdown = useCallback(() => {
        setShowProfileDropDown(!showProfileDropDown)
    })
    const goToLoginPage = useCallback(() => {
        navigate('/login')
    })
    const goToHomePage = useCallback(() => {
        navigate('/home')
    })
    const handleLogout = useCallback(async () => {
        goToHomePage()
        await logOutUser()
    })
    const handleAdminPanel = () => {
        navigate('/admin');
    }
    const handleManageProducts = () => {
        navigate('/manage-products')
    }

    const searchBarExcludedPaths = ['/login', '/forgot-password', '/signup', '/reset-password']

    function handleManageAccount() {
        navigate('/manage-account')
    }

    // Handle online/offline status update
    useEffect(() => {
        if (user && user.user_id) {
            const statusRef = doc(db, "userStatus", user.user_id);
            const goOnline = () => setDoc(statusRef, { online: true }, { merge: true });
            const goOffline = () => setDoc(statusRef, { online: false }, { merge: true });

            const handleVisibilityChange = () => {
                if (document.visibilityState === 'hidden') {
                    goOffline();
                } else {
                    goOnline();
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', goOffline);
            goOnline();

            return () => {
                goOffline();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('beforeunload', goOffline);
            };
        }
    }, [user]);
    return (
        <div className="NavBar">
            <div onClick={goToHomePage}>
                <img
                    className="navbar-company-logo content-brandLogo"
                    alt="RentItAll"
                />
            </div>
            <div className='nav-actions'>
                <div className='nav-items'>
                    <div className='item-wrapper'>
                        <a href='/rental-items' className='item'>
                            Rentals
                        </a>
                    </div>
                    {
                        loginData.isLoggedIn && user && user.is_admin ? (
                            <div className='item-wrapper'>
                                <a onClick={handleAdminPanel} className='item'>
                                    Admin Panel
                                </a>
                            </div>
                        ) : (<></>)
                    }
                    {
                        loginData.isLoggedIn && user && (
                            <div className='item-wrapper'>
                                <a href='/messaging' className='item'>
                                    Messaging
                                </a>
                            </div>
                        )
                    }
                </div>
                <div className="navbar-actions">
                    {
                        !searchBarExcludedPaths.includes(location.pathname) &&
                        (
                            <div className='search-bar-wrapper'>
                                <form className='search-bar-form' onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
                                    <div className='input-wrapper'>
                                        <input type="text" id="searchbar" name="searchbar" value={searchInput.value} placeholder="Search..." onChange={(e) => {
                                            setSearchInput({
                                                value: e.target.value,
                                                voice: false
                                            })
                                        }} />
                                    </div>
                                    {searchInput.value.length > 0 && <span className='remove-text-element' onClick={(e) => {
                                        setSearchInput({
                                            value: '',
                                            voice: false
                                        })
                                    }}><CloseIcon color='white' fontSize='8' /></span>}
                                    {voiceSupported && <button type='button' className='mic' onClick={listen}>{isListening ? <MicOffIcon color='white' /> : <MicIcon color='white' />}</button>}
                                    <button type="submit" className='search-submit'><SearchIcon color='white' /></button>
                                </form>
                            </div>
                        )
                    }
                    <button onClick={props.handleProductListModal} className='secondary-button list-your-item-button'>
                        List your item
                    </button>
                    {
                        loginData.isLoggedIn && user ? (
                            <div className='user-profile-wrapper' onClick={toggleProfileDropdown}>
                                <div className='user-profile'>
                                    <div className='user-profile-name' title={user.firstName + ' ' + user.lastName}><CgProfile color='white' size='32' /> {user.firstName + ' ' + user.lastName}</div>
                                    {
                                        showProfileDropDown ? <IoIosArrowUp color='white' /> :
                                            <IoIosArrowDown color='white' />
                                    }
                                </div>
                                {showProfileDropDown &&
                                    <div className='user-profile-dropdown'>
                                        <div className='each-action' onClick={handleManageAccount}>Your Account</div>
                                        <div className='each-action' onClick={handleManageProducts}>Manage Products</div>
                                        {/* <div className='each-action'></div>
                                    <div className='each-action'></div> */}
                                        <div className='each-action'>
                                            <button
                                                onClick={handleLogout}
                                                className='sign-out-button'
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        ) : (
                            <button
                                onClick={goToLoginPage}
                                className='sign-in-button'
                            >
                                Sign In
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}