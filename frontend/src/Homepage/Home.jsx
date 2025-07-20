import { Link } from "react-router-dom";
import {
  FaUsers,
  FaTicketAlt,
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCreditCard,
  FaUserPlus,
  FaFilter,
  FaArrowRight,
  FaMusic,
  FaFilm,
  FaRunning,
  FaMicrophoneAlt,
  FaChartLine,
  FaBell,
  FaQrcode,
  FaWallet,
  FaCalendarPlus,
  FaChartBar,
  FaMoneyBillWave
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const FeatureCard = ({ icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        rotate: 0,
        transition: { 
          delay: index * 0.1, 
          duration: 0.7,
          type: "spring",
          stiffness: 100
        },
      });
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotate: -5 }}
      animate={controls}
      whileHover={{ 
        y: -10,
        rotate: 0.5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="bg-gradient-to-br from-white to-white/90 backdrop-blur-lg border border-white/30 rounded-[30px] shadow-xl hover:shadow-2xl p-6 transition-all duration-300 relative group overflow-hidden"
    >
      <motion.div 
        className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-tr from-[#f40752]/10 to-[#f9ab8f]/10 rounded-full"
        initial={{ scale: 0 }}
        whileHover={{ scale: 2 }}
        transition={{ duration: 0.5 }}
      />
      
      <div className="flex justify-center mb-5">
        <motion.div 
          className="p-4 bg-gradient-to-tr from-[#f40752] to-[#f9ab8f] rounded-full shadow-md border border-white/30"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {icon}
        </motion.div>
      </div>

      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-gray-800 font-[Poppins]">
        {title}
      </h3>

      <p className="text-gray-600 text-center group-hover:text-gray-800 transition-colors duration-300">
        {description}
      </p>
    </motion.div>
  );
};

const StepCard = ({ step, icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { 
          delay: index * 0.15, 
          duration: 0.7,
          type: "spring",
          bounce: 0.4
        },
      });
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileHover={{
        y: -5,
        transition: { type: "spring", stiffness: 300 }
      }}
      className="relative group"
    >
      <motion.div 
        className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md z-10"
        whileHover={{ 
          scale: 1.1,
          rotate: [0, 10, -10, 0],
          transition: { duration: 0.5 }
        }}
      >
        {step}
      </motion.div>

      <div className="bg-gradient-to-br from-white to-white/90 backdrop-blur-xl p-8 pt-14 rounded-[30px] border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
        <motion.div 
          className="flex justify-center mb-6"
          whileHover={{ 
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-[#f40752] to-[#f9ab8f] rounded-full flex items-center justify-center shadow-md text-white text-2xl">
            {icon}
          </div>
        </motion.div>

        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-3 text-gray-800 font-[Poppins]">
          {title}
        </h3>

        <p className="text-gray-600 text-center group-hover:text-gray-800 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, type: "spring", stiffness: 100 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] font-[DM Sans] overflow-x-hidden relative text-gray-800">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#f9ab8f]/30 to-[#f40752]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-tr from-white/20 to-white/0 rounded-full blur-2xl bottom-10 right-10 animate-pulse" />
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-[Poppins] leading-tight flex flex-wrap"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.04 },
                },
              }}
            >
              {"BOOKiT – BOOK Your Event , Your Way"
                .split(" ")
                .map((word, wordIndex) => (
                  <span key={wordIndex} className="inline-block mr-2">
                    {word.split("").map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        variants={letterVariants}
                        className={`${
                          ["BOOK", "BOOKiT"].includes(word) && char !== " "
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#f40752] to-[#f9ab8f]"
                            : ""
                        }`}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
            </motion.h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              "Sports ho , Movies ho , Concerts ho ya ho Stand Up , You Just Need BOOKiT for this Weekend."
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/signup"
                className="px-8 py-3 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                Start Booking 
                <FaArrowRight />
              </Link>
            </div>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
  className="lg:w-1/2 relative"
>
  <div className="bg-white/80 backdrop-blur-md rounded-[30px] p-3 border border-white/30 shadow-2xl overflow-hidden">
    {/* Animated background elements */}
    <motion.div 
      className="absolute -top-20 -left-20 w-40 h-40 bg-[#f40752]/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div 
      className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#f9ab8f]/20 rounded-full blur-xl"
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />

    {/* Main content container */}
    <div className="bg-gradient-to-br from-[#f9ab8f] to-[#f40752] rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
      {/* Floating event icons */}
      <motion.div
        className="absolute top-1/4 left-1/4 text-white/30 text-3xl"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FaMusic />
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-1/4 text-white/30 text-4xl"
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <FaFilm />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 text-white/30 text-3xl"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 8, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <FaRunning />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/3 right-1/3 text-white/30 text-4xl"
        animate={{
          y: [0, 12, 0],
          rotate: [0, -8, 0]
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <FaMicrophoneAlt />
      </motion.div>

      {/* Main animated content */}
      <motion.div
        animate={{
          y: [0, -15, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-white text-center p-6 z-10"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaTicketAlt className="text-6xl mx-auto mb-4 drop-shadow-lg" />
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold mb-2 drop-shadow-md"
          animate={{
            scale: [1, 1.03, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          Your Next Adventure Starts Here
        </motion.h3>
        
        <motion.p
          className="text-white/90 mb-4 drop-shadow-sm"
          animate={{
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Concerts • Movies • Sports • Stand-Up
        </motion.p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            to="/login"
            className="px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-sm font-medium flex items-center gap-2"
          >
            <FaSearch className="text-sm" />
            Browse Events
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </div>
</motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-[Poppins] mb-4">
              BOOKiT.com Features You'll Actually Use
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Because Entertainment Jaruri hai Dost.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<FaTicketAlt className="text-white text-4xl" />}
                title="All Event Types"
                description="From concerts to sports, movies to stand-up - we've got all your entertainment needs covered."
                index={0}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 md:mt-12">
              <FeatureCard
                icon={<FaChartLine className="text-white text-4xl" />}
                title="Trending Events"
                description="Discover what's hot in your city with our real-time trending events."
                index={1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<FaBell className="text-white text-4xl" />}
                title="Personalized Alerts"
                description="Get notified when new events get announced."
                index={2}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Event Organizers Section */}
      <section className="py-20 bg-gradient-to-br from-[#f9f5f7] to-[#f5e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-[Poppins] mb-4">
              For Event Organizers
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Launch your event tickets on our platform and reach thousands of potential attendees
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<FaCalendarPlus className="text-white text-4xl" />}
                title="Create Events"
                description="Easily set up your events with our intuitive dashboard."
                index={0}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 md:mt-12">
              <FeatureCard
                icon={<FaChartBar className="text-white text-4xl" />}
                title="Analytics"
                description="Track ticket bookings and user payments."
                index={1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<FaMoneyBillWave className="text-white text-4xl" />}
                title="Get Paid Fast"
                description="Receive payments directly to your account with our secure system."
                index={2}
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/signup?type=organizer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#f40752] to-[#f9ab8f] text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 gap-2 shadow-lg"
            >
              <FaUserPlus />
              Sign Up as Organizer
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-[#F8F5F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-[Poppins] mb-4">
              How BOOKiT Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Teen kadam – aur Weekend Plan , Sorted Ek Dum.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants}>
              <StepCard
                step="1"
                icon={<FaUserPlus className="text-white text-2xl" />}
                title="Create Account"
                description="Sign up in seconds to start your entertainment journey."
                index={0}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StepCard
                step="2"
                icon={<FaSearch className="text-white text-2xl" />}
                title="Find Events"
                description="Browse by category, date, or venue to find perfect events."
                index={1}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StepCard
                step="3"
                icon={<FaCreditCard className="text-white text-2xl" />}
                title="Secure Booking"
                description="Hold the Seats and Easily checkout with payment."
                index={2}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-[Poppins] mb-4">
              Explore Event Categories
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Something for everyone's taste
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <FaMusic />, title: "Concerts", color: "from-purple-500 to-pink-500" },
              { icon: <FaFilm />, title: "Movies", color: "from-blue-500 to-cyan-500" },
              { icon: <FaRunning />, title: "Sports", color: "from-green-500 to-teal-500" },
              { icon: <FaMicrophoneAlt />, title: "Stand-Up", color: "from-yellow-500 to-orange-500" },
            ].map((category, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-white to-white/90 p-6 rounded-xl shadow-md text-center cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-tr ${category.color} rounded-full flex items-center justify-center shadow-md text-white text-2xl mx-auto mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Tickets Section */}
      <section className="py-20 bg-gradient-to-br from-[#f8f5f7] to-[#f0e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaQrcode className="text-6xl text-[#f40752] mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-center mb-4">Digital Tickets</h3>
                <p className="text-gray-600 text-center">
                  No more paper tickets! Download instant digital tickets.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <FaWallet className="text-6xl text-[#f9ab8f] mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-center mb-4">Easy Payments</h3>
                <p className="text-gray-600 text-center">
                Easily checkout with payment with our system.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#f40752] to-[#f9ab8f] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[4px] rounded-[30px]"></div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-6 font-[Poppins] text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Stop saying "Ticket Kha Se Lau?"
          </motion.h2>

          <motion.p 
            className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Just BOOKiT – kyunki Entertainment zaroori hai.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:scale-105 hover:bg-white/30 transition-all duration-300 gap-2 shadow-lg"
            >
              <FaTicketAlt />
              Get Started Now
              <FaArrowRight />
            </Link>
          </motion.div>

          <motion.p 
            className="mt-6 text-sm text-white/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Free forever • Zero judgement • Emotional damage optional
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default Home;