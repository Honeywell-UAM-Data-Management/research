'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Plane,
  Wind,
  Battery,
  Cpu,
  Cog,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type UAMComponent = {
  id: string;
  make: string;
  model: string;
  age: number;
  condition: string;
  owner: string;
  services: string[];
  docType: string;
};

const UAMComponentCard = ({ component }: { component: UAMComponent }) => {
  const getIcon = (docType: string) => {
    switch (docType) {
      case 'VTOL Engine':
      case 'Propulsion System':
        return Plane;
      case 'Electric Propeller':
      case 'Wing Assembly':
        return Wind;
      case 'High-Capacity Battery':
      case 'Energy Harvesting System':
        return Battery;
      case 'Flight Controller':
      case 'Autopilot System':
        return Cpu;
      case 'Electric Motor':
      case 'Lift System':
        return Cog;
      default:
        return FileText;
    }
  };

  const Icon = getIcon(component.docType);

  return (
    <Card className="w-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="border-b border-gray-100 bg-gray-50">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
          <Icon className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-blue-700">{component.make}</span> {component.model}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-sm px-2 py-1 bg-purple-100 text-purple-700">
            ID: {component.id}
          </Badge>
          <Badge
            variant="outline"
            className="text-sm px-2 py-1 bg-green-100 text-green-700 border-green-300 font-medium"
          >
            {component.docType}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Age: {component.age} years</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Owner: {component.owner}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Condition: {component.condition}</span>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-800">
            <Cog className="w-4 h-4 mr-2 text-orange-600" />
            Services
          </h4>
          <div className="flex flex-wrap gap-1">
            {Array.isArray(component.services) && component.services.length > 0 ? (
              component.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                  {service}
                </Badge>
              ))
            ) : (
              <span className="text-gray-400 text-xs">No services recorded</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ageRanges = [
  { label: '< 5 years', min: 0, max: 4 },
  { label: '5-9 years', min: 5, max: 9 },
  { label: '10-14 years', min: 10, max: 14 },
  { label: '15-19 years', min: 15, max: 19 },
  { label: '20-24 years', min: 20, max: 24 },
  { label: '25-29 years', min: 25, max: 29 },
  { label: '30+ ', min: 30, max: Infinity },
];

export default function UAMComponentExplorer() {
  const [components, setComponents] = useState<UAMComponent[]>([]);
  const [searchParams, setSearchParams] = useState<Partial<UAMComponent> & { ageRange?: string; services: string[] }>({
    services: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 6;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:4000/api/engines'); // Replace with your actual API endpoint
        const data = await response.json();
        console.log('Fetched data:', data);
    
        // Map the data to match the frontend structure
        const formattedData = data.map((item) => ({
          id: item.ID || 'Unknown ID', // Map "ID" to "id"
          make: item.Make || 'Unknown Make', // Map "Make" to "make"
          model: item.Model || 'Unknown Model', // Map "Model" to "model"
          age: parseInt(item.Age, 10) || 0, // Map "Age" to "age" and ensure it's a number
          condition: item.Condition || 'Unknown Condition', // Map "Condition" to "condition"
          owner: item.Owner || 'Unknown Owner', // Map "Owner" to "owner"
          services: item.Services || [], // Map "Services" to "services"
          docType: item.docType || 'Unknown Type', // Map "docType" to "docType"
        }));
    
        setComponents(formattedData); // Set formatted data to state
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const filteredComponents = useMemo(() => {
    return components.filter((component) =>
      Object.entries(searchParams).every(([key, value]) => {
        if (value === undefined || value === '') return true;
        if (key === 'id') return component.id === value;
        if (key === 'ageRange') {
          const [min, max] = value.split('-').map(Number);
          return component.age >= min && component.age <= max;
        }
        if (key === 'services') {
          return searchParams.services.length === 0 || component.services.some((service) => searchParams.services.includes(service));
        }
        return component[key as keyof UAMComponent]?.toString().toLowerCase().includes(value.toLowerCase());
      })
    );
  }, [searchParams, components]);

  const paginatedComponents = useMemo(() => {
    const startIndex = (currentPage - 1) * componentsPerPage;
    return filteredComponents.slice(startIndex, startIndex + componentsPerPage);
  }, [filteredComponents, currentPage]);

  const totalPages = Math.ceil(filteredComponents.length / componentsPerPage);

  const allServices = useMemo(() => {
    const servicesSet = new Set<string>();
    components.forEach((component) => {
      component.services?.forEach((service) => servicesSet.add(service));
    });
    return Array.from(servicesSet);
  }, [components]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">UAM Data Management</h1>

      <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4 justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
              Select Search Fields <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border-gray-200">
            {Object.keys(components[0] || {}).map((field) => (
              <DropdownMenuCheckboxItem
                key={field}
                checked={field in searchParams}
                onCheckedChange={(checked) => {
                  setSearchParams((prev) =>
                    checked ? { ...prev, [field]: '' } : { ...prev, [field]: undefined }
                  );
                }}
              >
                {field}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {Object.entries(searchParams)
          .filter(([_, value]) => value !== undefined)
          .map(([field, _]) => (
            <Input
              key={field}
              placeholder={`Search ${field}`}
              onChange={(e) =>
                setSearchParams((prev) => ({ ...prev, [field]: e.target.value }))
              }
            />
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedComponents.map((component, index) => (
          <motion.div
            key={`${component.id}-${index}`} // Combines id and index to ensure unique keys
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UAMComponentCard component={component} />
          </motion.div>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No UAM components found matching your search criteria.</p>
      )}

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// The following commented code is the demo UI application that does not integrate with our blockchain backend API.


// 'use client'

// import { useState, useMemo } from 'react'
// import { motion } from 'framer-motion'
// import { ChevronDown, Plane, Wind, Battery, Cpu, Cog, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const mockUAMComponents = [
//   { id: 'UAM001', make: 'VertiJet', model: 'VJ-2000', age: 5, condition: 'Excellent', owner: 'SkyTaxi', services: ['Rotor Alignment', 'Battery Check'], docType: 'VTOL Engine' },
//   { id: 'UAM002', make: 'AeroProp', model: 'AP-500', age: 8, condition: 'Good', owner: 'UrbanAir', services: ['Noise Reduction', 'Efficiency Tuning'], docType: 'Electric Propeller' },
//   { id: 'UAM003', make: 'SkyCell', model: 'SC-100', age: 1, condition: 'New', owner: 'EcoFly', services: [], docType: 'High-Capacity Battery' },
//   { id: 'UAM004', make: 'NeuroFlight', model: 'NF-750', age: 12, condition: 'Excellent', owner: 'MetroAvia', services: ['AI Update', 'Sensor Calibration'], docType: 'Flight Controller' },
//   { id: 'UAM005', make: 'QuietDrive', model: 'QD-300', age: 15, condition: 'Fair', owner: 'SilentAir', services: ['Acoustic Optimization', 'Efficiency Check'], docType: 'Electric Motor' },
//   { id: 'UAM006', make: 'VertiJet', model: 'VJ-3000', age: 22, condition: 'Excellent', owner: 'SkyTaxi', services: ['Tilt Mechanism Service', 'Avionics Update'], docType: 'VTOL Engine' },
//   { id: 'UAM007', make: 'AeroLift', model: 'AL-100', age: 3, condition: 'Good', owner: 'UrbanAir', services: ['Lift System Check', 'Software Update'], docType: 'Lift System' },
//   { id: 'UAM008', make: 'SkyWing', model: 'SW-200', age: 7, condition: 'Excellent', owner: 'MetroAvia', services: ['Aerodynamic Tuning', 'Structural Inspection'], docType: 'Wing Assembly' },
//   { id: 'UAM009', make: 'ElectroPulse', model: 'EP-500', age: 2, condition: 'New', owner: 'EcoFly', services: ['Initial Setup', 'Performance Test'], docType: 'Electric Motor' },
//   { id: 'UAM010', make: 'UrbanGlide', model: 'UG-1000', age: 10, condition: 'Good', owner: 'SkyTaxi', services: ['Navigation Update', 'Obstacle Avoidance Calibration'], docType: 'Autopilot System' },
//   { id: 'UAM011', make: 'AirMatrix', model: 'AM-300', age: 6, condition: 'Excellent', owner: 'UrbanAir', services: ['Composite Repair', 'Weight Optimization'], docType: 'Airframe' },
//   { id: 'UAM012', make: 'VertiThrust', model: 'VT-400', age: 4, condition: 'Good', owner: 'SilentAir', services: ['Thrust Vectoring Alignment', 'Efficiency Test'], docType: 'Propulsion System' },
//   { id: 'UAM013', make: 'SkyLink', model: 'SL-750', age: 9, condition: 'Fair', owner: 'MetroAvia', services: ['Antenna Replacement', '5G Upgrade'], docType: 'Communication System' },
//   { id: 'UAM014', make: 'AeroVision', model: 'AV-200', age: 3, condition: 'Excellent', owner: 'EcoFly', services: ['Lens Cleaning', 'Night Vision Calibration'], docType: 'Sensor Suite' },
//   { id: 'UAM015', make: 'UrbanDock', model: 'UD-500', age: 5, condition: 'Good', owner: 'SkyTaxi', services: ['Charging Port Maintenance', 'Safety System Check'], docType: 'Docking Station' },
//   { id: 'UAM016', make: 'AirGuard', model: 'AG-100', age: 2, condition: 'New', owner: 'UrbanAir', services: ['Firewall Update', 'Intrusion Detection Test'], docType: 'Cybersecurity Module' },
//   { id: 'UAM017', make: 'SkyHarvest', model: 'SH-300', age: 7, condition: 'Good', owner: 'EcoFly', services: ['Solar Panel Cleaning', 'Efficiency Measurement'], docType: 'Energy Harvesting System' },
//   { id: 'UAM018', make: 'VertiCool', model: 'VC-200', age: 4, condition: 'Excellent', owner: 'MetroAvia', services: ['Coolant Refill', 'Thermal Management Check'], docType: 'Cooling System' },
//   { id: 'UAM019', make: 'AeroComfort', model: 'AC-400', age: 6, condition: 'Good', owner: 'SkyTaxi', services: ['Seat Adjustment', 'Climate Control Calibration'], docType: 'Passenger Cabin' },
//   { id: 'UAM020', make: 'UrbanWhisper', model: 'UW-100', age: 3, condition: 'Excellent', owner: 'SilentAir', services: ['Acoustic Lining Replacement', 'Noise Level Test'], docType: 'Noise Reduction System' },
//   { id: 'UAM021', make: 'SkyBalance', model: 'SB-500', age: 5, condition: 'Good', owner: 'UrbanAir', services: ['Gyroscope Calibration', 'Stability Test'], docType: 'Stabilization System' },
//   { id: 'UAM022', make: 'AeroCharge', model: 'AC-750', age: 2, condition: 'New', owner: 'EcoFly', services: ['Charging Algorithm Update', 'Capacity Test'], docType: 'Rapid Charging System' },
//   { id: 'UAM023', make: 'VertiLand', model: 'VL-300', age: 8, condition: 'Fair', owner: 'MetroAvia', services: ['Landing Gear Overhaul', 'Shock Absorber Replacement'], docType: 'Landing System' },
//   { id: 'UAM024', make: 'UrbanSense', model: 'US-200', age: 4, condition: 'Excellent', owner: 'SkyTaxi', services: ['Sensor Array Alignment', 'Data Fusion Test'], docType: 'Environmental Sensor Suite' },
//   { id: 'UAM025', make: 'AirFlow', model: 'AF-400', age: 6, condition: 'Good', owner: 'SilentAir', services: ['Duct Cleaning', 'Airflow Optimization'], docType: 'Air Management System' },
//   { id: 'UAM026', make: 'SkyBeam', model: 'SB-100', age: 3, condition: 'Excellent', owner: 'UrbanAir', services: ['Laser Alignment', 'Range Test'], docType: 'LiDAR System' },
//   { id: 'UAM027', make: 'VertiMed', model: 'VM-500', age: 2, condition: 'New', owner: 'MetroAvia', services: ['Medical Equipment Check', 'Sanitization'], docType: 'Medical Module' },
//   { id: 'UAM028', make: 'AeroLink', model: 'AL-200', age: 5, condition: 'Good', owner: 'EcoFly', services: ['Mesh Network Update', 'Bandwidth Test'], docType: 'Inter-Vehicle Communication' },
//   { id: 'UAM029', make: 'UrbanShield', model: 'US-300', age: 7, condition: 'Fair', owner: 'SkyTaxi', services: ['Impact Resistance Test', 'Coating Renewal'], docType: 'Protective Shell' },
//   { id: 'UAM030', make: 'SkyHook', model: 'SH-400', age: 4, condition: 'Excellent', owner: 'SilentAir', services: ['Cable Tension Adjustment', 'Load Capacity Test'], docType: 'External Cargo System' },
// ]

// type UAMComponent = {
//   id: string
//   make: string
//   model: string
//   age: number
//   condition: string
//   owner: string
//   services: string[]
//   docType: string
// }

// const UAMComponentCard = ({ component }: { component: UAMComponent }) => {
//   const getIcon = (docType: string) => {
//     switch (docType) {
//       case 'VTOL Engine':
//       case 'Propulsion System':
//         return Plane
//       case 'Electric Propeller':
//       case 'Wing Assembly':
//         return Wind
//       case 'High-Capacity Battery':
//       case 'Energy Harvesting System':
//         return Battery
//       case 'Flight Controller':
//       case 'Autopilot System':
//         return Cpu
//       case 'Electric Motor':
//       case 'Lift System':
//         return Cog
//       default:
//         return FileText
//     }
//   }
  
//   const Icon = getIcon(component.docType)

//   return (
//     <Card className="w-full bg-white shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
//       <CardHeader className="border-b border-gray-100 bg-gray-50">
//         <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
//           <Icon className="w-5 h-5 mr-2 text-blue-600" />
//           <span className="text-blue-700">{component.make}</span> {component.model}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="pt-4 space-y-4">
//         <div className="flex justify-between items-center">
//           <Badge variant="secondary" className="text-sm px-2 py-1 bg-purple-100 text-purple-700">ID: {component.id}</Badge>
//           <Badge variant="outline" className="text-sm px-2 py-1 bg-green-100 text-green-700 border-green-300 font-medium">
//             {component.docType}
//           </Badge>
//         </div>
//         <div className="grid grid-cols-2 gap-2 text-sm">
//           <div className="flex items-center space-x-2">
//             <FileText className="w-4 h-4 text-gray-500" />
//             <span className="text-gray-700">Age: {component.age} years</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <User className="w-4 h-4 text-gray-500" />
//             <span className="text-gray-700">Owner: {component.owner}</span>
//           </div>
//           <div className="flex items-center space-x-2">
//             <FileText className="w-4 h-4 text-gray-500" />
//             <span className="text-gray-700">Condition: {component.condition}</span>
//           </div>
//         </div>
//         <div>
//           <h4 className="text-sm font-semibold mb-2 flex items-center text-gray-800">
//             <Cog className="w-4 h-4 mr-2 text-orange-600" />
//             Services
//           </h4>
//           <div className="flex flex-wrap gap-1">
//             {component.services.length > 0 ? (
//               component.services.map((service, index) => (
//                 <Badge key={index} variant="secondary" className="text-xs bg-orange-100 text-orange-700">
//                   {service}
//                 </Badge>
//               ))
//             ) : (
//               <span className="text-gray-400 text-xs">No services recorded</span>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// const ageRanges = [
//   { label: '< 5 years', min: 0, max: 4 },
//   { label: '5-9 years', min: 5, max: 9 },
//   { label: '10-14 years', min: 10, max: 14 },
//   { label: '15-19 years', min: 15, max: 19 },
//   { label: '20-24 years', min: 20, max: 24 },
//   { label: '25-29 years', min: 25, max: 29 },
//   { label: '30+ ', min: 30, max: Infinity },
// ]

// export default function UAMComponentExplorer() {
//   const [searchParams, setSearchParams] = useState<Partial<UAMComponent> & { ageRange?: string, services: string[] }>({ services: [] })
//   const [selectedFields, setSelectedFields] = useState<string[]>([])
//   const [currentPage, setCurrentPage] = useState(1)
//   const componentsPerPage = 6

//   const allServices = useMemo(() => {
//     const servicesSet = new Set<string>()
//     mockUAMComponents.forEach(component => {
//       component.services?.forEach(service => servicesSet.add(service))
//     })
//     return Array.from(servicesSet)
//   }, [])

//   const filteredComponents = useMemo(() => {
//     return mockUAMComponents.filter(component => 
//       Object.entries(searchParams).every(([key, value]) => {
//         if (value === undefined || value === '') return true
//         if (key === 'id') return component.id === value
//         if (key === 'ageRange') {
//           const [min, max] = value.split('-').map(Number)
//           return component.age >= min && component.age <= max
//         }
//         if (key === 'services') {
//           return searchParams.services.length === 0 || component.services.some(service => searchParams.services.includes(service))
//         }
//         if (key === 'model' || key === 'make') {
//           return component[key as keyof UAMComponent]?.toString().toLowerCase().includes(value.toLowerCase())
//         }
//         return component[key as keyof UAMComponent]?.toString().toLowerCase().includes(value.toLowerCase())
//       })
//     )
//   }, [searchParams])

//   const paginatedComponents = useMemo(() => {
//     const startIndex = (currentPage - 1) * componentsPerPage
//     return filteredComponents.slice(startIndex, startIndex + componentsPerPage)
//   }, [filteredComponents, currentPage])

//   const totalPages = Math.ceil(filteredComponents.length / componentsPerPage)

//   const uniqueValues = useMemo(() => {
//     const values: Record<string, Set<string | number>> = {}
//     mockUAMComponents.forEach(component => {
//       Object.entries(component).forEach(([key, value]) => {
//         if (!values[key]) values[key] = new Set()
//         if (Array.isArray(value)) {
//           value.forEach(v => v !== undefined && values[key].add(v))
//         } else if (value !== undefined) {
//           values[key].add(value)
//         }
//       })
//     })
//     return values
//   }, [])

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 p-8">
//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">UAM Data Management</h1>
      
//       <div className="max-w-4xl mx-auto mb-8 flex flex-wrap gap-4 justify-center">
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
//               Select Search Fields <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="w-56 bg-white border-gray-200">
//             {Object.keys(mockUAMComponents[0]).map((field) => (
//               <DropdownMenuCheckboxItem
//                 key={field}
//                 checked={selectedFields.includes(field)}
//                 onCheckedChange={(checked) => {
//                   setSelectedFields(prev => 
//                     checked 
//                       ? [...prev, field]
//                       : prev.filter(f => f !== field)
//                   )
//                   if (!checked) {
//                     setSearchParams(prev => {
//                       const { [field]: _, ...rest } = prev
//                       return rest
//                     })
//                   }
//                 }}
//                 className="text-gray-700 hover:bg-gray-50"
//               >
//                 {field}
//               </DropdownMenuCheckboxItem>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {selectedFields.map((field) => {
//           if (field === 'id' || field === 'make' || field === 'model') {
//             return (
//               <Input
//                 key={field}
//                 placeholder={`Search ${field}`}
//                 className="w-[180px] border-gray-300 text-gray-800 placeholder-gray-400"
//                 onChange={(e) => setSearchParams(prev => ({ ...prev, [field]: e.target.value }))}
//               />
//             )
//           } else if (field === 'age') {
//             return (
//               <Select
//                 key={field}
//                 onValueChange={(value) => setSearchParams(prev => ({ ...prev, ageRange: value }))}
//               >
//                 <SelectTrigger className="w-[180px] border-gray-300 text-gray-800 bg-white">
//                   <SelectValue placeholder="Select age range" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white border-gray-200">
//                   {ageRanges.map((range) => (
//                     <SelectItem key={range.label} value={`${range.min}-${range.max}`} className="text-gray-700 hover:bg-gray-50">
//                       {range.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )
//           } else if (field === 'services') {
//             return (
//               <Select
//                 key={field}
//                 onValueChange={(value) => setSearchParams(prev => ({ ...prev, services: [value] }))}
//               >
//                 <SelectTrigger className="w-[180px] border-gray-300 text-gray-800 bg-white">
//                   <SelectValue placeholder="Select service" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white border-gray-200">
//                   {allServices.map((service) => (
//                     <SelectItem key={service} value={service} className="text-gray-700 hover:bg-gray-50">
//                       {service}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )
//           } else {
//             return (
//               <Select
//                 key={field}
//                 onValueChange={(value) => setSearchParams(prev => ({ ...prev, [field]: value }))}
//               >
//                 <SelectTrigger className="w-[180px] border-gray-300 text-gray-800 bg-white">
//                   <SelectValue placeholder={`Select ${field}`} />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white border-gray-200">
//                   {Array.from(uniqueValues[field]).map((value) => (
//                     <SelectItem key={String(value)} value={String(value)} className="text-gray-700 hover:bg-gray-50">
//                       {String(value)}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )
//           }
//         })}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {paginatedComponents.map((component) => (
//           <motion.div
//             key={component.id}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <UAMComponentCard component={component} />
//           </motion.div>
//         ))}
//       </div>

//       {filteredComponents.length === 0 && (
//         <p className="text-center text-gray-500 mt-8">No UAM components found matching your search criteria.</p>
//       )}

//       <div className="flex justify-between items-center mt-8">
//         <Button
//           onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//           className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//         >
//           <ChevronLeft className="w-4 h-4 mr-2" /> Previous
//         </Button>
//         <p className="text-gray-700">
//           Page {currentPage} of {totalPages}
//         </p>
//         <Button
//           onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//           className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//         >
//           Next <ChevronRight className="w-4 h-4 ml-2" />
//         </Button>
//       </div>

//       <div className="text-center mt-8">
//         <p className="text-xl text-gray-700">
//           Showing {paginatedComponents.length} of {filteredComponents.length} UAM components
//         </p>
//       </div>
//     </div>
//   )
// }
