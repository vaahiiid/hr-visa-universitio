import React from "react";
import { motion } from "framer-motion";
import { Users, Clock } from "lucide-react";

const Header = ({ employeeCount }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="page-header py-6 px-4 md:px-8 mb-10 rounded-xl"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="bg-white/25 p-3 rounded-full mr-4 shadow-md"
            >
              <img src="https://storage.googleapis.com/hostinger-horizons-assets-prod/3fc2bcbf-9ff5-4dd1-b724-ac34eb3d196e/2a0983f9ffbd6d222994de9f3e4c1c9f.png" alt="Universitio Logo" className="h-12 w-auto" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">HR Visa Management</h1>
              <p className="text-white/80 text-sm sm:text-base">Track employee visa status and expiry dates</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="flex items-center gap-4 md:gap-6"
          >
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow">
              <Users className="h-5 w-5 mr-2 text-white/90" />
              <span className="font-semibold text-sm sm:text-base">{employeeCount} Employees</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center shadow">
              <Clock className="h-5 w-5 mr-2 text-white/90" />
              <span className="font-semibold text-sm sm:text-base">Visa Tracking</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;