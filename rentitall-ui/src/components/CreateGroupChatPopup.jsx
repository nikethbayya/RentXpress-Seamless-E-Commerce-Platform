import React, { useCallback, useState } from "react";
import { Modal } from "./Modal";
import './../styles/CreateGroupChatPopup.css'
import axios from "axios";
import { useUser } from "../hooks/UserContext";

export const CreateGroupChatPopup = (props) => {
    const { user } = useUser();
    const [ownerEmail, setOwnerEmail] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const handleModalClose = useCallback(() => {
        setOwnerEmail("")
        setUserEmail("")
        props.closeModal()
    })

    const handleOwnerEmailInput = (e) => {
        setOwnerEmail(e.target.value)
    }

    const handleUserEmailInput = (e) => {
        setUserEmail(e.target.value)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(ownerEmail === userEmail) {
            alert('Owner email & user email can\'t be same')
            return
        }
        if(user.email == ownerEmail || user.email == userEmail) {
            alert('Cannot enter your own email')
            return
        }
        const results = await axios.post(`${process.env.REACT_APP_LOGIN_SERVICE}/get-user-ids-by-email`, {
            emails: [ownerEmail, userEmail]
        });
        console.log(results.data.userDetails)
        const userIds = results.data.userDetails
        props.create(userIds.map(u => u.user_id))
        handleModalClose()
    }

    return (
        <React.Fragment>
            <Modal show={props.show} closeModal={handleModalClose} title="Add members to the group chat">
                <div className="add-grp-members-form">
                    <form onSubmit={handleSubmit}>
                    <div className="field-wrapper">
                                <label htmlFor="ownerEmail" className="">
                                    Product Owner Email 
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="ownerEmail"
                                        name="ownerEmail"
                                        type="email"
                                        value={ownerEmail}
                                        autoComplete="email"
                                        placeholder="Enter the product owner email"
                                        required
                                        onChange={handleOwnerEmailInput}
                                    />
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label htmlFor="userEmail" className="">
                                    User Email address
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        id="userEmail"
                                        name="userEmail"
                                        type="email"
                                        value={userEmail}
                                        autoComplete="email"
                                        placeholder="Enter the user email"
                                        required
                                        onChange={handleUserEmailInput}
                                    />
                                </div>
                            </div>
                            <button type="submit">Create Group</button>
                    </form>
                </div>
            </Modal>
        </React.Fragment>
    )
}