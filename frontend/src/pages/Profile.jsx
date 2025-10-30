import { useState, useEffect } from 'react'
import apiInstance from '../apiInstance';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchUser = async() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            navigate('/login');
            return;
        }

        try {
            const response = await apiInstance.get("/auth/profile");
             console.log(response)
            setUser(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch profile');
            if(error.response?.status === 401) {
                localStorage.removeItem('token'); // Clear invalid token
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

   
    return (
        <div className="p-4">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : user ? (
                <div>
                    <h1>Profile</h1>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </div>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    )
}

export default Profile;