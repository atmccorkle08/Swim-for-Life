export interface Coach {
  name: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
}

export const coaches: Coach[] = [
  {
    name: "Aidan McCorkle",
    bio: "Active member at the North Palm Beach Swim Team with 6 years of competitive swimming experience. Red Cross Certified Water Safety Instructor (WSI) and Certified Lifeguard. Co-founder of Swim for Life.",
    photo: "/images/coach-aidan.svg",
    email: "atmccorkle08@gmail.com",
    phone: "(917)-821-3667",
  },
  {
    name: "Blake Peters",
    bio: "Competitive swimmer at the North Palm Beach Swim Team. Red Cross Certified WSI and Lifeguard. Passionate about helping people gain confidence and safety in the pool.",
    photo: "/images/coach-blake.svg",
    email: "bapeters_1@icloud.com",
    phone: "(561)-388-7370",
  },
];
