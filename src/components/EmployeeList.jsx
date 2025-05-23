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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          Employee Directory
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "critical" ? "destructive" : "outline"}
            onClick={() => setFilterStatus("critical")}
            className="whitespace-nowrap"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Critical
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEmployees.map((employee) => (
          <motion.div
            key={employee.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmployeeCard employee={employee} />
          </motion.div>
        ))}
        {filteredEmployees.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No employees found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;