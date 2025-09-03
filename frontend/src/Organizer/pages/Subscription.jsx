import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaCrown, FaCheck, FaArrowRight, FaFire, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../config/api.js';

const Subscription = () => {
  const organizer_id = Cookies.get("id");
  const token = Cookies.get('token');
  const navigate = useNavigate();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [plans, setPlans] = useState([]);
  const [currPlan, setCurrPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profile = await axios.get(API_ENDPOINTS.AUTH.PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plansRes = await axios.get(API_ENDPOINTS.ADMIN.PLANS.GET_ALL);
        const currentPlanRes = await axios.get(API_ENDPOINTS.ADMIN.SUBSCRIPTION.CURRENT_PLAN(organizer_id));

        setSubscriptionStatus(profile.data.result);
        setPlans(plansRes.data.result);
        setCurrPlan(currentPlanRes.data.result);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load subscription data');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleExplorePlan = (planId) => navigate(`/organizer/subscription/${planId}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#f40752]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 p-6 rounded-lg my-8 shadow-sm">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8 py-8 bg-white/80 rounded-xl shadow-xl border border-white/30 backdrop-blur-md"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f]">
          Subscription Plans
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3">
          Choose the perfect plan to unlock more events and premium features for your organization.
        </p>
      </div>

      {/* Current Plan */}
      <motion.div layout className="bg-white/90 rounded-xl shadow p-6 mb-10 border border-white/30">
        <h2 className="text-2xl font-semibold text-[#f40752] mb-6 flex items-center">
          <FaStar className="mr-3" />
          Your Current Subscription
        </h2>

        {subscriptionStatus?.current_subscription_id ? (
          <motion.div layout className="border border-gray-200 rounded-lg p-6 shadow-inner bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">{currPlan?.plan_name || 'Current'} Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    ['Subscription ID', currPlan?.subscription_id],
                    ['Plan Period', `${new Date(currPlan?.start_date).toLocaleDateString()} - ${new Date(currPlan?.end_date).toLocaleDateString()}`],
                    ['Plan ID', currPlan?.plan_id],
                    ['Organizer Email', currPlan?.organizer_email],
                    ['Status', 'Active']
                  ].map(([label, value], idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="text-sm">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="inline-block bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Active Subscription
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div layout className="border border-gray-200 rounded-lg p-6 shadow-inner bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Free Tier</h3>
                <p>
                  <span className="font-medium">Events remaining:</span> {subscriptionStatus?.free_events_remaining || 0} / 5
                </p>
              </div>
              <div>
                <span className="inline-block bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Free Plan
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Plan Cards */}
      <motion.div layout className="mb-10">
        <h2 className="text-2xl font-semibold text-[#f40752] mb-8 flex items-center">
          <FaFire className="mr-3" />
          Available Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              layout
              key={plan.plan_id}
              whileHover={{ scale: 1.03 }}
              className={`rounded-xl overflow-hidden bg-white border ${
                plan.plan_name === 'Enterprise'
                  ? 'border-[#f40752] shadow-xl'
                  : 'border-gray-200 shadow-lg'
              }`}
            >
              <div className={`px-6 py-4 ${
                plan.plan_name === 'Enterprise'
                  ? 'bg-gradient-to-r from-[#f40752] to-[#f9ab8f]'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center">
                      {plan.plan_name}
                      {plan.plan_name === 'Enterprise' && <FaCrown className="ml-2 text-yellow-300" />}
                    </h3>
                    <p className="text-gray-100 mt-1">{plan.description}</p>
                  </div>
                  {plan.plan_name === 'Enterprise' && (
                    <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <FaCheck className="text-[#f40752] mt-1 mr-3 flex-shrink-0" />
                    <span>
                      <span className="font-medium">{plan.max_events === 9999 ? 'Unlimited' : plan.max_events}</span> events per month
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaCheck className="text-[#f40752] mt-1 mr-3 flex-shrink-0" />
                    <span>
                      <span className="font-medium">{plan.duration_days}-day</span> subscription period
                    </span>
                  </li>
                </ul>
                <button
                  onClick={() => handleExplorePlan(plan.plan_id)}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${
                    plan.plan_name === 'Enterprise'
                      ? 'bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-xl text-white'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:shadow-lg text-white'
                  } hover:scale-[1.02]`}
                >
                  Explore Plan <FaArrowRight className="ml-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Subscription;