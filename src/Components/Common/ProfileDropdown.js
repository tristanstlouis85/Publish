import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {

    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));

    const [userName, setUserName] = useState(user?.email || "Admin");
    const [userAvatar, setUserAvatar] = useState(user?.photoURL || avatar1);
    const [email, setemail] = useState("");

    useEffect(() => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            setUserName(
                process.env.REACT_APP_DEFAULTAUTH === "firebase" ? obj?.providerData?.[0]?.displayName?.split(" ")?.[0] ||
                    obj?.providerData?.[0]?.email ||
                    // Get first name from display name
                    obj?.displayName?.split(" ")[0]
                    : "Admin"
            );

            if (obj?.photoURL) {
                setUserAvatar(obj.photoURL)
                setemail(obj.email);
            }
        }
    }, [userName, user]);
    

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={userAvatar || avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                                        <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/profile"} className="dropdown-item">
                            <i className="mdi mdi-account-circle text-muted fs-20 align-middle me-1"></i>
                            <span className="align-middle">Profile</span>
                        </Link>
                    </DropdownItem>

                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/integrations"} className="dropdown-item">
                            <i
                                className="mdi mdi-connection text-muted fs-20 align-middle me-1"></i> <span
                                    className="align-middle">Integrations</span>
                        </Link>
                    </DropdownItem>

                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/help"} className="dropdown-item">
                            <i
                                className="mdi mdi-lifebuoy text-muted fs-20 align-middle me-1"></i> <span
                                    className="align-middle">Support</span>
                        </Link>
                    </DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/settings"} className="dropdown-item">
                            {/* <span
                                className="badge bg-soft-success text-success mt-1 float-end">New</span> */}
                            <i
                                className="mdi mdi-cog-outline text-muted fs-20 align-middle me-1"></i> <span
                                    className="align-middle">Settings</span>
                        </Link>
                    </DropdownItem>

                    <DropdownItem className='p-0'>
                        <Link to={process.env.PUBLIC_URL + "/logout"} className="dropdown-item">
                            <i
                                className="mdi mdi-logout text-muted fs-20 align-middle me-1"></i> <span
                                    className="align-middle" data-key="t-logout">Logout</span>
                                    <p>{email}</p>
                        </Link>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;