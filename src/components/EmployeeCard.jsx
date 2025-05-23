import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CountdownTimer from "@/components/CountdownTimer";
import { Calendar, MapPin, Briefcase, Flag, Phone, Mail } from "lucide-react";

const EmployeeCard = ({ employee }) => {
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      return dateString; 
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -50 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
      className="h-full"
    >
      <Card className="employee-card h-full flex flex-col">
        <CardHeader className="items-center pt-6 pb-4">
          <Avatar className="h-32 w-32 border-4 border-primary shadow-lg mb-3">
            <AvatarImage src={employee.photo} alt={employee.name} className="object-cover"/>
            <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
              {getInitials(employee.name)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl font-bold text-center text-foreground">{employee.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Briefcase className="mr-1.5 h-4 w-4" />
            {employee.position}
          </div>
           <Badge variant={employee.status === "Active" ? "success" : "warning"} className="mt-2">
            {employee.status}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow px-4 pb-4 space-y-2.5">
          <div className="flex items-center text-xs">
            <Flag className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Nationality:</span> <span className="ml-1 font-medium text-foreground">{employee.nationality}</span>
          </div>
          <div className="flex items-center text-xs">
            <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Department:</span> <span className="ml-1 font-medium text-foreground">{employee.department}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center text-xs">
              <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Phone:</span> <a href={`tel:${employee.phone}`} className="ml-1 font-medium text-primary hover:underline">{employee.phone}</a>
            </div>
          )}
          {employee.email && (
            <div className="flex items-center text-xs">
              <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Email:</span> <a href={`mailto:${employee.email}`} className="ml-1 font-medium text-primary hover:underline truncate" title={employee.email}>{employee.email}</a>
            </div>
          )}
          <div className="flex items-center text-xs">
            <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">Joined:</span> <span className="ml-1 font-medium text-foreground">{formatDate(employee.joinDate)}</span>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4 px-4 pb-4 bg-secondary/30 rounded-b-xl">
          <CountdownTimer expiryDate={employee.visaExpiry} />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;