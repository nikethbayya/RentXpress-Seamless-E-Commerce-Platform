import {BsArrowLeftCircle} from "react-icons/bs";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export const BackArrowButton = (props) => {
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
                <BsArrowLeftCircle
                    // color={isHovered ? 'white' : 'black'}
                    // color={props.color || 'white'}
                    size='28'
                    className="transition-colors duration-300"
                />
            </button>
        </div>
    )
}