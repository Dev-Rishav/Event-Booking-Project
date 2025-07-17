import { Link } from "react-router-dom";
import {
  FaUsers,
  FaReceipt,
  FaChartPie,
  FaMobileAlt,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
// import HomeImage from "../assets/logo.png";

const FeatureCard = ({ icon, title, description, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.1, duration: 0.5 },
      });
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-lg border border-white/20 rounded-[30px] shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:-translate-y-2 relative group"
    >
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="p-4 bg-gradient-to-tr from-[#034078] to-[#1282a2] rounded-full shadow-md border border-white/20">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-[#1B1C1E] dark:text-white font-[Poppins]">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-800 dark:text-gray-200 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
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
        transition: { delay: index * 0.15, duration: 0.5 },
      });
    }
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="relative group"
    >
      {/* Step Bubble */}
      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-[#034078] to-[#1282a2] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md z-10">
        {step}
      </div>

      {/* Card Container */}
      <div className="bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-white/5 backdrop-blur-xl p-8 pt-14 rounded-[30px] border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Icon Circle */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#034078] to-[#1282a2] rounded-full flex items-center justify-center shadow-md text-white text-2xl">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-3 text-[#1B1C1E] dark:text-white font-[Poppins]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-800 dark:text-gray-200 text-center group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
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
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#E4EBF5] dark:from-[#0a1128] dark:to-[#001f54] font-[DM Sans] overflow-x-hidden relative text-[#1B1C1E] dark:text-white">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#3EB489]/30 to-[#A5F3A1]/20 rounded-full blur-3xl top-10 left-1/4 animate-pulse" />
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
  {"BOOKiT – BOOK Events Within Budget"
    .split(" ")
    .map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block mr-2">
        {word.split("").map((char, charIndex) => (
          <motion.span
            key={charIndex}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className={`${
              ["BOOK", "BOOKiT"].includes(word) && char !== " "
                ? "text-transparent bg-clip-text bg-gradient-to-r from-[#81c3d7] to-[#1282a2]"
                : ""
            }`}
          >
            {char}
          </motion.span>
        ))}
      </span>
    ))}
</motion.h1>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              "Sports ho , Movies ho  , Concerts ho ya ho Stand Up  , You Just Need BOOKiT for this Weekend."
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to={"/signup"}
                className="px-8 py-3 bg-gradient-to-r from-[#001f54] to-[#1282a2] text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
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
            className="lg:w-1/2"
          >
            <div className="bg-white/20 backdrop-blur-md rounded-[30px] p-3 border border-white/20 shadow-2xl">
              <img
                src="#"
                alt="Udhaari preview"
                loading="lazy"
                className="rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B1C1E] dark:text-white font-[Poppins] mb-4">
              BOOKiT.com Features You'll Actually Use
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
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
                icon={<FaUsers className="text-white text-4xl" />}
                title="Book Shows"
                description="Banayein doston ke saath weekend ka Plan Sports , Movies , Concerts , Standup — Just Browse and Book."
                index={0}
              />
            </motion.div>
            <motion.div variants={itemVariants} className="mt-6 md:mt-12">
              <FeatureCard
                icon={<FaReceipt className="text-white text-4xl" />}
                title="Event Ticket Launch"
                description="Create Events as Event Organizer and Launch their Show's Ticket here."
                index={1}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <FeatureCard
                icon={<FaChartPie className="text-white text-4xl" />}
                title="Offers Subscription"
                description="Subscribe Kijiye Kisi Bhi Plan k Sath or Kijiye Event Ticket Launch."
                index={2}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-[#EFF3F8] dark:bg-[#0a1128]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1B1C1E] dark:text-white font-[Poppins] mb-4">
              How BOOKiT Works
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Teen kadam – aur Weekend Plan , Sorted Ek Dum.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-8 items-center"

          >
            <motion.div variants={itemVariants} className="w-full max-w-[350px]">
              <div className="w-full flex items-stretch">
                <StepCard
                  step="1"
                  icon={<FaUsers />}
                  title="Do Register"
                  description="Just Signup/Login and you are good to go."
                  index={0}
                  heightClass="h-full"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-[350px]">
              <div className="w-full flex items-stretch">
                <StepCard
                  step="2"
                  icon={<FaReceipt />}
                  title="Browse By City"
                  description="Seacrh City name and then apply filters according to the Event Category and Date."
                  index={1}
                  heightClass="h-full"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="w-full max-w-[350px]">
              <div className="w-full flex items-stretch">
                <StepCard
                  step="3"
                  icon={<FaSyncAlt />}
                  title="Select and Book"
                  description="Choose appropriate show within an event and then just select the tickets and book you tickets."
                  index={2}
                  heightClass="h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#3FB984] to-[#81E6D9] dark:from-[#0a1128] dark:to-[#1282a2] text-white text-center relative overflow-hidden">
        {/* Frosted Glass Overlay */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-[4px] rounded-[30px]"></div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-[Poppins] text-white drop-shadow-md">
            Stop saying “Ticket Kha Se Lau?”
          </h2>

          <p className="text-lg sm:text-xl text-white/90 dark:text-white/85 mb-10 max-w-2xl mx-auto">
            Just BOOKiT – kyunki Entertainment zaroori hai.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center px-8 py-4 bg-white/20 dark:bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-xl hover:scale-105 hover:bg-white/30 dark:hover:bg-white/20 transition-all duration-300 gap-2 shadow-lg"
          >
            <FaMobileAlt />
            Get Started Now
            <FaArrowRight />
          </Link>

          <p className="mt-6 text-sm text-white/80 dark:text-white/60">
            Free forever • Zero judgement • Emotional damage optional
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;