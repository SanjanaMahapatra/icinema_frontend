import { faChevronLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SecondaryNavbar: FC<{ currentUrl: string }> = ({ currentUrl }) => {
    const {btnref, selectedSeatsCount, selectedShowDetails} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("currentUrl : ", currentUrl);
        if(currentUrl.includes('/view-booking-detail') && selectedShowDetails.theatreName === ''){
            navigate(-1);
        }
    }, [currentUrl, navigate, selectedShowDetails])

    const handleSeatsModal = () => {
        if(btnref.current){
            btnref.current.click();
        }
    }

    return (
        <div className='card shadow px-4 py-2' style={{minWidth: "55em"}}>
            <div className='d-flex justify-content-between flex-wrap'>
                <div className='d-flex'>
                    <button className="border-0 bg-transparent me-2" onClick= {() => navigate(-1)}>
                        <FontAwesomeIcon
                        icon={faChevronLeft}
                        style={{ fontWeight: "700", fontSize: "1.2em" ,color: "#666" }}
                        />
                    </button>
                    <div className='d-flex flex-column'>
                        <div className='text-muted' style={{ fontSize: "0.8em", color: '#666' }}>{selectedShowDetails.movieName}</div>
                        <div className='text-musted' style={{ fontWeight: "700", fontSize: "0.8em", color: '#666' }}>
                            {selectedShowDetails.theatreName} | {`${selectedShowDetails.showDate.date} ${selectedShowDetails.showDate.month}, ${selectedShowDetails.showTime}`}
                        </div>
                    </div>
                </div>
                {currentUrl.includes("/seat-layout") && <div>
                    <button className='btn btn-outline-secondary me-5' style={{ fontWeight: 600, fontSize: "0.8em" }} onClick={handleSeatsModal}>
                            {selectedSeatsCount} Tickets
                        <span className='ms-2'><FontAwesomeIcon icon={faPencilAlt} /></span>
                    </button>
                </div>}
            </div>
        </div>
    )
}

export default SecondaryNavbar;
