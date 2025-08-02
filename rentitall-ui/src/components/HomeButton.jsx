import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaHome} from "react-icons/fa";

export const HomeButton = (props) => {
    const [isHovered,setIsHovered] = useState(false);

    const navigate = useNavigate();
    return (
        <div className={props.className}>
            <button
                onClick={() => navigate(props.path)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="bg-transparent p-0"
            >
                <FaHome
                    // color={isHovered ? 'white' : 'black'}
                    // color={props.color || 'white'}
                    size='28'
                    className="transition-colors duration-300"
                />
            </button>
        </div>
    )
}