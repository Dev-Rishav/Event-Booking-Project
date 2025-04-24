import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllSubscriptionPlans } from '../redux/slices/adminslice/adminActions';

const AdminSubscriptionPlans = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const plans = JSON.parse(localStorage.getItem("Allplans"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
        togglePlanStatus();
    }, []);

    const fetchPlans = async () => {
        try {
            dispatch(fetchAllSubscriptionPlans());
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to load subscription plans');
            setIsLoading(false);
        }
    };

    const togglePlanStatus = async (plan) => {
        console.log();
        
        const planId = plan.plan_id; 
        try {
            if(plan.is_active === true){
            await axios.patch(`http://localhost:8001/api/admin/inactiveplan/${planId}`);
            }else if(plan.is_active === false){
                await axios.patch(`http://localhost:8001/api/admin/activeplan/${planId}`);
            }
            fetchPlans();
        } catch (error) {
            console.error('Error updating plan status:', error);
            toast.error('Failed to update plan status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Subscription Plans</h1>
                        <p className="mt-2 text-sm text-gray-600">Manage all subscription plans</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/create-subscription')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition-colors duration-200"
                    >
                        Create New Plan
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-800">No plans available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating your first plan
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/plans/create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <svg
                                    className="-ml-1 mr-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                New Plan
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div key={plan.plan_id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                                <div className="px-5 py-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{plan.plan_name}</h3>
                                            <p className={`mt-1 text-xs font-bold ${plan.is_active === true ? 'text-red-600' : 'text-gray-500'}`}>
                                                {plan.is_active}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                            ${plan.price}
                                        </span>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                                        {plan.description || 'No description provided'}
                                    </p>
                                    <div className="mt-5 grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs font-medium text-gray-500">Max Events</p>
                                            <p className="text-base font-semibold text-gray-800">{plan.max_events}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs font-medium text-gray-500">Duration</p>
                                            <p className="text-base font-semibold text-gray-800">{plan.duration_days} days</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-5 py-4 flex justify-between border-t border-gray-200">
                                    <button
                                        onClick={() => togglePlanStatus(plan)}
                                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                                            plan.is_active === true
                                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                                        } transition-colors duration-200`}
                                    >
                                        {plan.is_active === true ? 'Deactivate' : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSubscriptionPlans;