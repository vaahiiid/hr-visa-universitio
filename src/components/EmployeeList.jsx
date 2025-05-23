import React, { useState } from "react";
import { motion } from "framer-motion";
import EmployeeCard from "@/components/EmployeeCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

const EmployeeList = ({ employees }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredEmployees = employees.filter((employee) => {
    const nameMatch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const positionMatch = employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const departmentMatch = employee.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const nationalityMatch = employee.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || positionMatch || departmentMatch || nationalityMatch;
    
    const visaExpiryDate = new Date(employee.visaExpiry);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const isCritical = visaExpiryDate <= thirtyDaysFromNow && visaExpiryDate > now;
    const isWarning = visaExpiryDate <= ninetyDaysFromNow && visaExpiryDate > thirtyDaysFromNow;
    const isValid = visaExpiryDate > ninetyDaysFromNow;
    const isExpired = visaExpiryDate <= now;


    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "critical" && isCritical) ||
                         (filterStatus === "warning" && isWarning) ||
                         (filterStatus === "valid" && isValid) ||
                         (filterStatus === "expired" && isExpired);
    
    return matchesSearch && matchesStatus;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg shadow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, position, department, nationality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            All
          </Button>
          <Button
            variant={filterStatus === "critical" ? "destructive" : "outline"}
            onClick={() => setFilterStatus("critical")}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-4 w-4" />
            Critical
          </Button>
          <Button
            variant={filterStatus === "warning" ? "secondary" : "outline"}
            onClick={() => setFilterStatus("warning")}
            className="flex items-center gap-1 text-amber-600 border-amber-500 hover:bg-amber-100"
          >
            <ShieldAlert className="h-4 w-4" />
            Warning
          </Button>
          <Button
            variant={filterStatus === "valid" ? "secondary" : "outline"}
            onClick={() => setFilterStatus("valid")}
            className="flex items-center gap-1 text-green-600 border-green-500 hover:bg-green-100"
          >
            <CheckCircle2 className="h-4 w-4" />
            Valid
          </Button>
           <Button
            variant={filterStatus === "expired" ? "destructive" : "outline"}
            onClick={() => setFilterStatus("expired")}
            className="flex items-center gap-1"
          >
            <Filter className="h-4 w-4" />
            Expired
          </Button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-xl font-semibold text-foreground">No Employees Found</p>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeList;