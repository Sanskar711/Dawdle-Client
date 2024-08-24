import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProspectList.css'; 
import goBack from '../../images/Group 20.png';
import api from '../../context/api';
import { useAuth } from '../../context/Authcontext';
import Modal from './Modal';
import BookingModal from '../BookingModal';

const ProspectList = () => {
    const [prospects, setProspects] = useState([]);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [loading, setLoading] = useState(false);  
    const [flashMessage, setFlashMessage] = useState('');  
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [productInfo, setProductInfo] = useState({});  // State to hold product info
    const [emailData, setEmailData] = useState({
        email_subject: '',
        email_body: '',
        poc_first_name: '',
        poc_last_name: '',
        poc_email: '',
        poc_designation: '',
    });

    const navigate = useNavigate();
    const { productId } = useParams();
    const { isAuthenticated, userId } = useAuth();  

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        api.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                setProspects(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    // Fetch product info
    useEffect(() => {
        api.get(`/users/product/${productId}/info/`)
            .then(response => {
                setProductInfo(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the product info!', error);
            });
    }, [productId]);

    const openEmailModal = (prospect) => {
        setSelectedProspect(prospect);
        setEmailData({
            poc_first_name: prospect.first_name,
            poc_last_name: prospect.last_name,
            poc_email: prospect.email,
            poc_designation: prospect.designation,
            email_subject: '',
            email_body: ''
        });
        setShowEmailModal(true);
    };

    const closeEmailModal = () => {
        setShowEmailModal(false);
        setSelectedProspect(null);
    };

    const openBookingModal = (prospect) => {
        setSelectedProspect(prospect);
        setShowBookingModal(true);
    };

    const closeBookingModal = () => {
        setShowBookingModal(false);
        setSelectedProspect(null);
    };

    const handleInputChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const emailRequestData = {
            user_id: userId,  
            prospect_id: selectedProspect.id,
            product_id: productId,
            ...emailData,
        };

        api.post('/users/email-request/', emailRequestData)
            .then(response => {
                console.log('Email request sent successfully:', response.data);
                setFlashMessage('Email sent successfully!');
                setTimeout(() => setFlashMessage(''), 3000);
                closeEmailModal();
            })
            .catch(error => {
                console.error('There was an error sending the email request:', error);
                setFlashMessage('Failed to send email.');
                setTimeout(() => setFlashMessage(''), 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleBookingModalAction = (action) => {
        const queryParams = new URLSearchParams({ prospectId: selectedProspect?.id });
        if (action === 'check') {
            navigate(`/product/${productId}/icp-qualifying-questions?${queryParams}`);
        } else {
            navigate(`/product/${productId}/options/book-meeting?${queryParams}`, {
                state: {
                    productName: productInfo.product_name,
                    companyName: selectedProspect.domain,
                },
            });
        }
        closeBookingModal();
    };
    

    return (
        <div className="prospect-list-container">
            <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
            <h1>Prospect List</h1>

            {flashMessage && <div className="flash-message">{flashMessage}</div>}

            <table className="prospect-list-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {prospects.map((prospect, index) => (
                        <tr key={index}>
                            <td>{prospect.company_name}</td>
                            <td>{prospect.geography}</td>
                            <td className='action'>
                                <button 
                                    className={`button-link ${prospect.status !== 'open' ? 'disabled' : ''}`} 
                                    onClick={prospect.status === 'open' ? () => openEmailModal(prospect) : null}
                                >
                                    Send Email
                                </button>
                                <button 
                                    className={`button-link ${prospect.status !== 'open' ? 'disabled' : ''}`}
                                    onClick={prospect.status === 'open' ? () => openBookingModal(prospect) : null}
                                >
                                    Book Meeting
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showEmailModal} onClose={closeEmailModal}>
                <h2>Send Email</h2>

                <form onSubmit={handleEmailSubmit}>
                    <div>
                        <label>Subject</label>
                        <input
                            type="text"
                            name="email_subject"
                            value={emailData.email_subject}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Body</label>
                        <textarea
                            name="email_body"
                            value={emailData.email_body}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="poc_first_name"
                            value={emailData.poc_first_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="poc_last_name"
                            value={emailData.poc_last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="poc_email"
                            value={emailData.poc_email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Designation</label>
                        <input
                            type="text"
                            name="poc_designation"
                            value={emailData.poc_designation}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                </form>
            </Modal>

            {showBookingModal && (
                <BookingModal
                    onClose={closeBookingModal}
                    onAction={handleBookingModalAction}
                    productName={productInfo.name}  // Using product name in booking modal
                />
            )}
        </div>
    );
};

export default ProspectList;
