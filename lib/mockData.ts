export interface TimelineStep {
  title: string;
  status: string;
  description: string;
  time: string;
  completed: boolean;
  current?: boolean;
  bubbleText?: string;
  bubbleImages?: string[];
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  priority: "CRITICAL" | "MEDIUM" | "LOW";
  status: "In Progress" | "Resolved" | "Pending Approval" | "Dispatched";
  location: string;
  time: string;
  image?: string;
  avatars?: string[];
  upvotes?: number;
  category: string;
  date: string;
  reporter?: string;
  assignedTo?: {
    name: string;
    avatar?: string;
  };
  responseTime?: string;
  citizensImpacted?: string;
  timeline?: TimelineStep[];
}

export const initialComplaints: Complaint[] = [
  {
    id: "CMP-8821902",
    title: "Broken Water Main - GEC Circle",
    priority: "CRITICAL",
    status: "In Progress",
    location: "Opposite Central Mall, GEC Circle, Ward 15",
    time: "Reported on Oct 24, 2023 • 09:15 AM",
    image: "https://images.pexels.com/photos/17934978/pexels-photo-17934978.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "A major water pipe burst occurred this morning around 8:45 AM. The pressure is extremely high, and water is flooding into the basements of nearby commercial buildings. Traffic at GEC Circle is being redirected as the road surface is becoming unstable. This is the third time a leak has been reported at this exact junction in the last six months. Immediate excavation and replacement of the section are required to prevent further road collapse.",
    category: "Public Utilities",
    date: "today",
    reporter: "Ahmed Kabir",
    assignedTo: {
      name: "WASA Maintenance Team B",
      avatar: "W"
    },
    responseTime: "1h 12m",
    citizensImpacted: "Est. 5,000+",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Complaint successfully logged in the system. Ticket ID CMP-8821902 generated.",
        time: "Oct 24, 2023 • 09:15 AM",
        completed: true
      },
      {
        title: "Agency Dispatched",
        status: "Assigned",
        description: "Forwarded to WASA Maintenance Department. Supervisor Rafiqul Islam assigned to lead the repair crew.",
        time: "Oct 24, 2023 • 09:45 AM",
        completed: true
      },
      {
        title: "Work Started",
        status: "In Progress",
        description: "Excavation started. Main valve shut off to control flow. Road crew on standby for surfacing.",
        time: "Oct 24, 2023 • 10:27 AM",
        completed: true,
        current: true,
        bubbleText: "Excavation started. Main valve shut off to control flow. Road crew on standby for surfacing.",
        bubbleImages: [
          "/complaints/working1.png",
          "/complaints/working2.png"
        ]
      },
      {
        title: "Issue Resolved",
        status: "Resolved",
        description: "Verification pending field crew confirmation.",
        time: "",
        completed: false
      }
    ]
  },
  {
    id: "1",
    title: "Large Pothole Hazard near GEC Circle",
    priority: "CRITICAL",
    status: "In Progress",
    location: "GEC Circle, East Gate",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
    description: "A massive pothole has appeared right in the middle of the intersection, causing multiple vehicle damages and major traffic congestion.",
    category: "roads",
    date: "today",
    reporter: "Tariqul Islam",
    assignedTo: {
      name: "CDA Roads Crew A",
      avatar: "C"
    },
    responseTime: "2h 40m",
    citizensImpacted: "Est. 3,500+",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Complaint logged under ID 1.",
        time: "Today • 12:30 PM",
        completed: true
      },
      {
        title: "Work Started",
        status: "In Progress",
        description: "Materials dispatched, excavation started.",
        time: "Today • 02:15 PM",
        completed: true,
        current: true
      }
    ]
  },
  {
    id: "2",
    title: "Street Light Malfunction - Road 04",
    priority: "MEDIUM",
    status: "Resolved",
    location: "Panchlaish R/A",
    time: "Yesterday",
    image: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?q=80&w=600&auto=format&fit=crop",
    description: "Three consecutive street lights are not working for the last 4 days. The entire alley is pitch black after 7 PM, making it unsafe for children and elderly.",
    category: "lighting",
    date: "yesterday",
    reporter: "Sadia Rahman",
    assignedTo: {
      name: "Ctg Power Board",
      avatar: "P"
    },
    responseTime: "18h 15m",
    citizensImpacted: "Est. 800",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Reported street light malfunction.",
        time: "Yesterday • 08:00 AM",
        completed: true
      },
      {
        title: "Issue Resolved",
        status: "Resolved",
        description: "Bulbs replaced, wiring fixed.",
        time: "Yesterday • 11:30 PM",
        completed: true
      }
    ]
  },
  {
    id: "3",
    title: "Blocked Drainage Outlet",
    priority: "LOW",
    status: "Pending Approval",
    location: "Agrabad access road",
    time: "2 days ago",
    description: "Sewerage overflow due to heavy rains and plastic blockage. Foul smell is spreading in the local market area.",
    avatars: ["JD", "AK"],
    category: "water",
    date: "week",
    reporter: "Jamil Chowdhury",
    responseTime: "Pending",
    citizensImpacted: "Est. 1,200",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Logged into system.",
        time: "2 days ago",
        completed: true,
        current: true
      }
    ]
  },
  {
    id: "4",
    title: "Garbage Pile-up Main Road",
    priority: "CRITICAL",
    status: "Dispatched",
    location: "Chawkbazar Circle",
    time: "3 days ago",
    description: "Waste collection hasn't arrived for 3 days. Garbage is spilling onto the main road causing traffic issues.",
    upvotes: 24,
    category: "waste",
    date: "week",
    reporter: "Imran Khan",
    assignedTo: {
      name: "CCC Waste Management Unit",
      avatar: "C"
    },
    responseTime: "4h 10m",
    citizensImpacted: "Est. 8,000+",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Report filed by Imran.",
        time: "3 days ago",
        completed: true
      },
      {
        title: "Agency Dispatched",
        status: "Dispatched",
        description: "Garbage trucks dispatched to Chawkbazar.",
        time: "3 days ago",
        completed: true,
        current: true
      }
    ]
  },
  {
    id: "5",
    title: "Broken Water Pipe Leakage",
    priority: "MEDIUM",
    status: "In Progress",
    location: "Halishahar Block B",
    time: "4 hours ago",
    description: "Clean drinking water is leaking from a main pipe line, causing water pressure loss in nearby houses and minor street flooding.",
    category: "water",
    date: "today",
    reporter: "Fahim Ahmed",
    assignedTo: {
      name: "WASA Team C",
      avatar: "W"
    },
    responseTime: "3h 0m",
    citizensImpacted: "Est. 2,000",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Report logged.",
        time: "4 hours ago",
        completed: true
      },
      {
        title: "Work Started",
        status: "In Progress",
        description: "Excavation and clamp installation in progress.",
        time: "1 hour ago",
        completed: true,
        current: true
      }
    ]
  },
  {
    id: "6",
    title: "Overflowing Dustbin near School",
    priority: "LOW",
    status: "Resolved",
    location: "Jamal Khan Road",
    time: "Yesterday",
    description: "Secondary waste transfer point dustbin is completely filled and overflowing onto the sidewalk next to municipal school.",
    category: "waste",
    date: "yesterday",
    reporter: "Mahmud Hasan",
    assignedTo: {
      name: "CCC Waste Unit 4",
      avatar: "C"
    },
    responseTime: "6h 45m",
    citizensImpacted: "Est. 600",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Report logged.",
        time: "Yesterday",
        completed: true
      },
      {
        title: "Issue Resolved",
        status: "Resolved",
        description: "Dustbin emptied and sidewalk washed clean.",
        time: "Yesterday",
        completed: true
      }
    ]
  },
  {
    id: "7",
    title: "Damaged Sidewalk Tiles",
    priority: "LOW",
    status: "Pending Approval",
    location: "Lalkhan Bazar",
    time: "5 days ago",
    description: "Walking path tiles are loose and broken, causing tripping hazards for pedestrians in busy retail corridor.",
    category: "roads",
    date: "week",
    reporter: "Nigar Sultana",
    responseTime: "Pending",
    citizensImpacted: "Est. 1,500",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Report registered.",
        time: "5 days ago",
        completed: true,
        current: true
      }
    ]
  },
  {
    id: "8",
    title: "Hazardous Dangling Cables",
    priority: "CRITICAL",
    status: "In Progress",
    location: "Bahaddarhat Junction",
    time: "Today",
    description: "Internet and power cables are hanging dangerously low over the street, close to double decker bus heights and store awnings.",
    category: "lighting",
    date: "today",
    reporter: "Anwar Hossain",
    assignedTo: {
      name: "Ctg Cable Association",
      avatar: "C"
    },
    responseTime: "1h 45m",
    citizensImpacted: "Est. 4,500+",
    timeline: [
      {
        title: "Report Submitted",
        status: "Pending",
        description: "Report filed.",
        time: "Today • 09:00 AM",
        completed: true
      },
      {
        title: "Work Started",
        status: "In Progress",
        description: "Tensioning and bundle lifting crew active on site.",
        time: "Today • 10:30 AM",
        completed: true,
        current: true
      }
    ]
  }
];
