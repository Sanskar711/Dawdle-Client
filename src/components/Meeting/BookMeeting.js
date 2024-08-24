import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './BookMeeting.css';
import goBack from '../../images/Group 20.png';
import users from '../../context/api';
import ProspectDetailsModal from './ProspectForm';
import QualifyingQuestionsModal from './QualifyingQuestionModal';
import { useAuth } from '../../context/Authcontext';

const BookMeeting = () => {
    const [prospects, setProspects] = useState([]);
    const [selectedProspect, setSelectedProspect] = useState('');
    const [prospectName, setProspectName] = useState('');
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const [isQualifyingModalOpen, setIsQualifyingModalOpen] = useState(false);
    const [useCases, setUseCases] = useState([]);
    const [productName, setProductName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();
    const { userId, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Retrieve prospectId from query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const prospectId = queryParams.get('prospectId');
        if (prospectId) {
            setSelectedProspect(prospectId);
        }
    }, [location]);

    // Fetch product name and company name using the API
    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await users.get(`users/product/${productId}/info/`);
                if (response.status !== 200) {
                    throw new Error(`Unexpected response status: ${response.status}`);
                }
                setProductName(response.data.name);
                setCompanyName(response.data.client_name);
            } catch (error) {
                console.error('Error fetching product information:', error);
            }
        };

        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        users.get(`/users/product/${productId}/prospects/`)
            .then(response => {
                const openProspects = response.data.filter(prospect => prospect.status === 'open');
                setProspects(openProspects);
            })
            .catch(error => {
                console.error('There was an error fetching the prospects!', error);
            });
    }, [productId]);

    useEffect(() => {
        if (isProspectModalOpen) {
            users.get(`/users/product/${productId}/usecases/`)
                .then(response => {
                    setUseCases(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the use cases!', error);
                });
        }
    }, [isProspectModalOpen, productId]);

    const handleSelectChange = (event) => {
        setSelectedProspect(event.target.value);
        if (event.target.value) {
            setProspectName('');
        }
    };

    const handleInputChange = (event) => {
        setProspectName(event.target.value);
        if (event.target.value) {
            setSelectedProspect('');
        }
    };

    const handleNextClick = () => {
        setIsProspectModalOpen(true);
    };

    return (
        <>
            <button className="go-back" onClick={() => navigate(-1)}>
                <img src={goBack} alt="Go Back" className="go-back-icon" />
            </button>
            <div className="book-meeting-container">
                <h1>{productName}</h1>
                <h2>{companyName}</h2>

                <div className="prospect-information">
                    <h3>Prospect Information</h3>
                    <p>Please provide the prospect information</p>

                    <div className="prospect-select">
                        <label>Select Prospect</label>
                        <select value={selectedProspect} onChange={handleSelectChange} disabled={!!prospectName}>
                            <option value="">Select Prospect</option>
                            {prospects.map((prospect) => (
                                <option key={prospect.id} value={prospect.id}>
                                    {prospect.company_name}
                                </option>
                            ))}
                        </select>
                        <small>Choose from the list provided or clear the selection</small>
                    </div>

                    <div className="or-divider">Or</div>

                    <div className="prospect-input">
                        <label>Provide Prospect</label>
                        <input
                            type="text"
                            placeholder="Enter Prospect Name"
                            value={prospectName}
                            onChange={handleInputChange}
                            disabled={!!selectedProspect}
                        />
                    </div>
                </div>

                <button className="next-button" onClick={handleNextClick}>
                    Next
                </button>
            </div>

            <ProspectDetailsModal
                isOpen={isProspectModalOpen}
                onClose={() => setIsProspectModalOpen(false)}
                onNext={() => { /* handle prospect submission */ }}
                useCases={useCases}
                newProspect={selectedProspect === ''}
            />

            <QualifyingQuestionsModal
                isOpen={isQualifyingModalOpen}
                onClose={() => setIsQualifyingModalOpen(false)}
                onSave={() => { /* handle qualifying submission */ }}
                productId={productId}
            />
        </>
    );
};

export default BookMeeting;
