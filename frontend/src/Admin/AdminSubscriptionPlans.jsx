import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllSubscriptionPlans } from '../redux/slices/adminslice/adminActions';
import { motion } from 'framer-motion';

const AdminSubscriptionPlans = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const plans = JSON.parse(localStorage.getItem("Allplans"));

  useEffect(() => {
    fetchPlans();
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
    const planId = plan.plan_id;
    try {
      if (plan.is_active) {
        await axios.patch(`http://localhost:8001/api/admin/inactiveplan/${planId}`);
      } else {
        await axios.patch(`http://localhost:8001/api/admin/activeplan/${planId}`);
      }
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast.error('Failed to update plan status');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen mt-16 ml-8 py-16 px-4 sm:px-6 lg:px-8 transition-all duration-300"
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f]">
              Subscription Plans
            </h1>
            <p className="mt-2 text-sm text-gray-600">Manage all subscription plans</p>
          </div>
          <button
            onClick={() => navigate('/admin/create-subscription')}
            className="bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-lg text-white px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105"
          >
            Create New Plan
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f40752]"></div>
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-white/30">
            <h3 className="mt-2 text-lg font-medium text-gray-800">No plans available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first plan
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/admin/create-subscription')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white shadow-md transition-all transform hover:scale-105"
              >
                New Plan
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.plan_id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{plan.plan_name}</h3>
                      <p
                        className={`mt-1 text-xs font-bold ${
                          plan.is_active ? 'text-[#f40752]' : 'text-gray-500'
                        }`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white">
                      ${plan.price}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    {plan.description || 'No description provided'}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-3 rounded-lg border border-white/30">
                      <p className="text-xs font-medium text-gray-500">Max Events</p>
                      <p className="text-base font-semibold text-gray-800">{plan.max_events}</p>
                    </div>
                    <div className="bg-white/50 p-3 rounded-lg border border-white/30">
                      <p className="text-xs font-medium text-gray-500">Duration</p>
                      <p className="text-base font-semibold text-gray-800">{plan.duration_days} days</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/50 px-5 py-4 flex justify-between border-t border-white/30">
                  <button
                    onClick={() => togglePlanStatus(plan)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      plan.is_active
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white hover:shadow-lg'
                    } transition-all`}
                  >
                    {plan.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminSubscriptionPlans;