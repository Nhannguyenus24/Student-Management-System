const config = {
  apiBaseUrl: "https://api.example.com",
  schoolName: "University of Natural Sciences",
  schoolLocation: "Ho Chi Minh, Vietnam",
  schoolAddress: "227 Nguyen Van Cu, District 5",
  schoolPhone: "028 3835 5373",
  schoolEmail: "hcmus@school.edu.vn",
  schoolWebsite: "https://hcmus.edu.vn",
  creationDeleteLimit: 30 * 60 * 1000, // 30 minutes,
  emailDomain: "student.university.edu.vn",
  phone: {
      countryCode: "+84", // Vietnam
      regex: "^(?:\\+84|0)(3|5|7|8|9)[0-9]{8}$"
  },
  studentStatusConfig: {
    "Đang học": ["Bảo lưu", "Tốt nghiệp", "Đình chỉ"],
    "Bảo lưu": ["Đang học", "Đình chỉ"],
    "Tốt nghiệp": [],
    "Đình chỉ": ["Đang học"],
  },
  startYear: 2000,
};

export default config;
