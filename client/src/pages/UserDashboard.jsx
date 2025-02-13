import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import UserDashSideBar from '../components/UserDashSideBar';

const UserDashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.set("tab");
        if (tabURL) {
            setTab(tabURL);
        }
    }, [location.search])
    return (
        <section className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                <UserDashSideBar />
            </div>


        </section>
    )
}

export default UserDashboard