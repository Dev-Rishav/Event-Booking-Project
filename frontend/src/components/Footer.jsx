import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center mt-24 pt-6 pb-12">
      {/* Logo */}
      <h2 className="text-white text-2xl font-bold mb-4">
        <span className="text-red-500">book</span>my<span className="text-red-500">show</span>
      </h2>

      {/* Social Media Icons */}
      <div className="flex justify-center space-x-6 mb-4 text-xl">
        <a href="#" className="hover:text-white"><FaFacebookF /></a>
        <a href="#" className="hover:text-white"><FaTwitter /></a>
        <a href="#" className="hover:text-white"><FaInstagram /></a>
        <a href="#" className="hover:text-white"><FaYoutube /></a>
        <a href="#" className="hover:text-white"><FaPinterest /></a>
        <a href="#" className="hover:text-white"><FaLinkedin /></a>
      </div>

      {/* Copyright */}
      <p className="text-sm px-4">
        Copyright 2025 © Bigtree Entertainment Pvt. Ltd. All Rights Reserved.
      </p>
      <p className="text-xs px-6 mt-2">
        The content and images used on this site are copyright protected and copyrights vest with the respective owners. Unauthorized use is prohibited and punishable by law.
      </p>
    </footer>
  );
};

export default Footer;

  