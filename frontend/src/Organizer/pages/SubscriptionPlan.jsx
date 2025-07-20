import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrganizerSubscription, fetchSubscriptionPlan } from '../../redux/slices/adminslice/adminActions';
import { resetSubscription } from '../../redux/slices/adminslice/adminSlice';
import { FaCheck, FaArrowLeft, FaCrown, FaStar } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const SubscriptionPlan = () => {
  const { planId } = useParams();
  const email = Cookies.get("id");
  const token = Cookies.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const plan = JSON.parse(localStorage.getItem("plan"));
  const { approvalUrl, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchSubscriptionPlan(planId));
  }, [dispatch, planId]);

  useEffect(() => {
    if (approvalUrl) {
      window.location.href = approvalUrl;
    }
  }, [approvalUrl]);

  const handleSubscribe = () => {
    const start_date = new Date();
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + plan.duration_days);

    setIsSubscribing(true);
    dispatch(resetSubscription());
    dispatch(createOrganizerSubscription({
      email,
      price: parseFloat(plan.price),
      plan_id: plan.plan_id,
      start_date,
      end_date
    }));
  };

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

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto bg-gray-100 border-l-4 border-gray-400 p-6 rounded-lg my-8 shadow-sm">
        <p className="text-gray-700 font-medium">Plan not found</p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto my-8 px-4 sm:px-6 lg:px-8 py-8 bg-white/80 rounded-xl shadow-xl border border-white/30 backdrop-blur-md"
    >
      <button
        onClick={() => navigate('/organizer/subscription')}
        className="flex items-center text-[#f40752] hover:text-[#f9ab8f] mb-6 transition-colors duration-300"
      >
        <FaArrowLeft className="mr-2" /> Back to Plans
      </button>

      <motion.div layout className={`rounded-xl overflow-hidden shadow-xl ${plan.plan_name === 'Enterprise' ? 'border-2 border-[#f40752]' : 'border border-gray-300'}`}>
        <div className={`p-6 md:p-8 ${plan.plan_name === 'Enterprise'
          ? 'bg-gradient-to-r from-[#f40752] to-[#f9ab8f]'
          : 'bg-gradient-to-r from-gray-600 to-gray-700'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center">
                {plan.plan_name} Plan
                {plan.plan_name === 'Enterprise' && <FaCrown className="ml-3 text-yellow-300" />}
              </h1>
              <p className="text-gray-100">{plan.description}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-3xl md:text-4xl font-bold text-white">${plan.price}</p>
              <p className="text-gray-200">per month</p>
              {plan.plan_name === 'Enterprise' && (
                <span className="inline-block mt-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaCheck className="text-[#f40752] mr-3" />
                Plan Features
              </h2>
              <ul className="space-y-3">
                {[
                  [`${plan.max_events === 9999 ? 'Unlimited' : plan.max_events} events`, "Create events per month"],
                  [`${plan.duration_days}-day period`, "Subscription duration"]
                ].map(([title, desc], idx) => (
                  <li key={idx} className="flex items-start">
                    <FaCheck className="text-[#f40752] mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{title}</span>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FaStar className="text-[#f40752] mr-3" />
                Subscription Benefits
              </h2>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-2">When you subscribe:</h3>
                <ul className="space-y-2">
                  {[
                    "Immediate access to all features",
                    `Create ${plan.max_events === 9999 ? 'unlimited' : plan.max_events} events`
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-[#f9ab8f] text-white rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">{i + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 md:pt-8">
            <button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className={`w-full px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                plan.plan_name === 'Enterprise'
                  ? 'bg-gradient-to-r from-[#f40752] to-[#f9ab8f] hover:shadow-xl'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:shadow-lg'
              } text-white ${isSubscribing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
            >
              {isSubscribing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Subscribe to ${plan.plan_name} Plan`
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubscriptionPlan;