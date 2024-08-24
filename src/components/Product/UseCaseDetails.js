import React, { useEffect, useState } from 'react';
import './UseCaseDetails.css';
import goBack from '../../images/Group 20.png';
import { useNavigate, useParams } from 'react-router-dom';
import frame1 from '../../images/frame.png';
import frame2 from '../../images/frame-2.png';
import frame3 from '../../images/frame-3.png';
import teacher from '../../images/Teacher.png';
import links from '../../images/icon.png';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';

const UseCaseDetails = () => {
    const [useCaseDetails, setUseCaseDetails] = useState({});
    const navigate = useNavigate();
    const { productId, useCaseId } = useParams();
    const { isAuthenticated} = useAuth();
    useEffect(()=>{
        if(!isAuthenticated){
            navigate('/login')
        }
    },[isAuthenticated])
    useEffect(() => {
        api.get(`/users/product/${productId}/usecases/${useCaseId}/`)
            .then(response => {
                setUseCaseDetails(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the use case details!", error);
            });
    }, [productId, useCaseId]);

    if (!useCaseDetails) {
        return <div>Loading...</div>;
    }

    // Split the reference links by space and filter out any empty strings
    const referenceLinks = useCaseDetails.reference_links 
        ? useCaseDetails.reference_links.split(/[\s\n]+/).filter(link => link) 
        : [];
    return (
        <>
            <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
            <div className="use-case-details">
                <div className="use-case-section">
                    <img src={frame1} alt="Problem Icon" />
                    <div>
                        <h2>About Problem/Use Case:</h2>
                        <p>{useCaseDetails.description}</p>
                    </div>
                </div>
                <div className="use-case-section">
                    <img src={frame2} alt="Solution Icon" />
                    <div>
                        <h2>How Product is solving the problem?</h2>
                        <p>{useCaseDetails.solution}</p>
                    </div>
                </div>
                <div className="use-case-section">
                    <img src={frame3} alt="Target Audience Icon" />
                    <div>
                        <h2>Who might be facing this problem?</h2>
                        <p>{useCaseDetails.target_audience}</p>
                    </div>
                </div>
                <div className="use-case-section">
                    <img src={teacher} alt="Pitch Icon" />
                    <div>
                        <h2>Sample Pitch</h2>
                        <p>{useCaseDetails.sample_pitch}</p>
                    </div>
                </div>
                <div className="use-case-section reference-links">
                    <img src={links} alt="Reference Links Icon" />
                    <div className='reference-links-details'>
                    <h2>Reference Links</h2>
                    <ul>
                        {referenceLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UseCaseDetails;
