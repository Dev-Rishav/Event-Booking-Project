import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCrown, FaCheck, FaArrowRight, FaFire, FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';

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

        // Fetch organizer's subscription status
        const response = await axios.get('http://localhost:8001/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch available subscription plans
        const plansResponse = await axios.get('http://localhost:8001/api/admin/get-plans');

        //fetch current plan of organizer
        const currRes = await axios.get(`http://localhost:8001/api/admin/organizer/current-plan/${organizer_id}`);

        setCurrPlan(currRes.data.result);
        setSubscriptionStatus(response.data.result);
        setPlans(plansResponse.data.result);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load subscription data');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleExplorePlan = (planId) => {
    navigate(`/organizer/subscription/${planId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-50 to-gray-50 border-l-4 border-red-500 p-6 rounded-lg my-8 shadow-sm">
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-red-600 bg-clip-text text-transparent">
          Subscription Plans
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan to unlock more events and premium features for your organization
        </p>
      </div>

      {/* Current Subscription Status */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-6 mb-12 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <FaStar className="text-red-500 mr-3" />
          Your Current Subscription
        </h2>

        {subscriptionStatus?.current_subscription_id ? (
          <div className="bg-gradient-to-r from-red-50 to-gray-50 border border-red-100 rounded-lg p-6 shadow-inner">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {currPlan?.plan_name || 'Current'} Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">Subscription ID</p>
                    <p className="text-sm font-mono text-gray-800">{currPlan?.subscription_id || 'N/A'}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">Plan Period</p>
                    <p className="text-sm text-gray-800">
                      {new Date(currPlan?.start_date).toLocaleDateString()} - {new Date(currPlan?.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">Plan ID</p>
                    <p className="text-sm text-gray-800">{currPlan?.plan_id || 'N/A'}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">Organizer Email</p>
                    <p className="text-sm text-gray-800">{currPlan?.organizer_email || 'N/A'}</p>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-500 font-medium">Status</p>
                    <p className="text-sm font-medium text-green-600">Active</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Active Subscription
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-300 rounded-lg p-6 shadow-inner">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Free Tier</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Events remaining:</span> {subscriptionStatus?.freeEventsRemaining || 0} / 5
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-block bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  Free Plan
                </span>
              </div>
            </div>
          </div>
        )}
        </div >

        {/* Available Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 flex items-center">
            <FaFire className="text-red-500 mr-3" />
            Available Plans
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.plan_id}
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-2 ${plan.plan_name === 'Enterprise'
                    ? 'border-2 border-red-300 shadow-xl'
                    : 'border border-gray-200 shadow-lg'
                  }`}
              >
                {/* Plan Header */}
                <div className={`px-6 py-4 ${plan.plan_name === 'Enterprise'
                    ? 'bg-gradient-to-r from-red-700 to-red-800'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800'
                  }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        {plan.plan_name}
                        {plan.plan_name === 'Enterprise' && (
                          <FaCrown className="ml-2 text-yellow-300" />
                        )}
                      </h3>
                      <p className="text-gray-200 mt-1">{plan.description}</p>
                    </div>
                    {plan.plan_name === 'Enterprise' && (
                      <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                        POPULAR
                      </span>
                    )}
                  </div>
                </div>

                {/* Plan Body */}
                <div className="p-6 bg-white">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <FaCheck className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{plan.max_events === 9999 ? 'Unlimited' : plan.max_events}</span> events per month
                      </span>
                    </li>
                    <li className="flex items-start">
                      <FaCheck className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">
                        <span className="font-medium">{plan.duration_days}-day</span> subscription period
                      </span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleExplorePlan(plan.plan_id)}
                    className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center ${plan.plan_name === 'Enterprise'
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-md'
                      }`}
                  >
                    Explore Plan <FaArrowRight className="ml-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      );
};

      export default Subscription;