import React from "react"
import './../styles/Footer.css'
import { useLocation } from "react-router-dom";

export const Footer = () => {
    const location = useLocation();
    return (
        <React.Fragment>
            {
                location.pathname !== '/messaging' &&
                (<div id="Footer">

                </div>)
            }
        </React.Fragment>
    )
}