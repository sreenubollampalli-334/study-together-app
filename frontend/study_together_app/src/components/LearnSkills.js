// src/pages/LearnSkills.js

import { useState } from "react";
import "../styles/learnskills.css";

function LearnSkills() {

  const [search, setSearch] = useState("");

  const courses = [

    // ================= TECH =================

    {
      title: "Java Programming",
      category: "Programming",
      image:
        "https://cdn-icons-png.flaticon.com/512/226/226777.png",
      link:
        "https://www.youtube.com/watch?v=eIrMbAQSU34"
    },

    {
      title: "Python Full Course",
      category: "Programming",
      image:
        "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
      link:
        "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
    },

    {
      title: "React JS",
      category: "Frontend",
      image:
        "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
      link:
        "https://www.youtube.com/watch?v=bMknfKXIFA8"
    },

    {
      title: "Spring Boot",
      category: "Backend",
      image:
        "https://cdn-icons-png.flaticon.com/512/226/226777.png",
      link:
        "https://www.youtube.com/watch?v=vtPkZShrvXQ"
    },

    {
      title: "Node JS",
      category: "Backend",
      image:
        "https://cdn-icons-png.flaticon.com/512/919/919825.png",
      link:
        "https://www.youtube.com/watch?v=TlB_eWDSMt4"
    },

    {
      title: "MongoDB",
      category: "Database",
      image:
        "https://cdn-icons-png.flaticon.com/512/919/919836.png",
      link:
        "https://www.youtube.com/watch?v=ofme2o29ngU"
    },

    {
      title: "SQL Database",
      category: "Database",
      image:
        "https://cdn-icons-png.flaticon.com/512/2772/2772128.png",
      link:
        "https://www.youtube.com/watch?v=HXV3zeQKqGY"
    },

    {
      title: "DSA in Java",
      category: "DSA",
      image:
        "https://cdn-icons-png.flaticon.com/512/6132/6132222.png",
      link:
        "https://www.youtube.com/watch?v=RBSGKlAvoiM"
    },

    {
      title: "Machine Learning",
      category: "AI",
      image:
        "https://cdn-icons-png.flaticon.com/512/2103/2103633.png",
      link:
        "https://www.youtube.com/watch?v=GwIo3gDZCVQ"
    },

    {
      title: "AWS Cloud",
      category: "Cloud",
      image:
        "https://cdn-icons-png.flaticon.com/512/873/873107.png",
      link:
        "https://www.youtube.com/watch?v=3hLmDS179YE"
    },

    {
      title: "Docker",
      category: "DevOps",
      image:
        "https://cdn-icons-png.flaticon.com/512/919/919853.png",
      link:
        "https://www.youtube.com/watch?v=3c-iBn73dDE"
    },

    {
      title: "Kubernetes",
      category: "DevOps",
      image:
        "https://cdn-icons-png.flaticon.com/512/919/919830.png",
      link:
        "https://www.youtube.com/watch?v=X48VuDVv0do"
    },

    {
      title: "Cyber Security",
      category: "Security",
      image:
        "https://cdn-icons-png.flaticon.com/512/3064/3064197.png",
      link:
        "https://www.youtube.com/watch?v=inWWhr5tnEA"
    },

    {
      title: "UI UX Design",
      category: "Design",
      image:
        "https://cdn-icons-png.flaticon.com/512/1828/1828919.png",
      link:
        "https://www.youtube.com/watch?v=c9Wg6Cb_YlU"
    },

    {
      title: "Android Development",
      category: "Mobile",
      image:
        "https://cdn-icons-png.flaticon.com/512/226/226770.png",
      link:
        "https://www.youtube.com/watch?v=fis26HvvDII"
    },

    {
      title: "Flutter",
      category: "Mobile",
      image:
        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
      link:
        "https://www.youtube.com/watch?v=1ukSR1GRtMU"
    },

    // ================= NON TECH =================

    {
      title: "Digital Marketing",
      category: "Marketing",
      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      link:
        "https://www.youtube.com/watch?v=nU-IIXBWlS4"
    },

    {
      title: "SEO Masterclass",
      category: "Marketing",
      image:
        "https://cdn-icons-png.flaticon.com/512/4149/4149647.png",
      link:
        "https://www.youtube.com/watch?v=xsVTqzratPs"
    },

    {
      title: "Stock Market Basics",
      category: "Finance",
      image:
        "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
      link:
        "https://www.youtube.com/watch?v=p7HKvqRI_Bo"
    },

    {
      title: "Personal Finance",
      category: "Finance",
      image:
        "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
      link:
        "https://www.youtube.com/watch?v=HQzoZfc3GwQ"
    },

    {
      title: "Public Speaking",
      category: "Communication",
      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
      link:
        "https://www.youtube.com/watch?v=Unzc731iCUY"
    },

    {
      title: "English Speaking",
      category: "Communication",
      image:
        "https://cdn-icons-png.flaticon.com/512/3898/3898150.png",
      link:
        "https://www.youtube.com/watch?v=juKd26qkNAw"
    },

    {
      title: "Video Editing",
      category: "Creative",
      image:
        "https://cdn-icons-png.flaticon.com/512/3039/3039385.png",
      link:
        "https://www.youtube.com/watch?v=8eDsvKwM40U"
    },

    {
      title: "Photography",
      category: "Creative",
      image:
        "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
      link:
        "https://www.youtube.com/watch?v=V7z7BAZdt2M"
    },

    {
      title: "Graphic Design",
      category: "Creative",
      image:
        "https://cdn-icons-png.flaticon.com/512/3159/3159310.png",
      link:
        "https://www.youtube.com/watch?v=BU_afT-aIn0"
    },

    {
      title: "Business Analytics",
      category: "Business",
      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
      link:
        "https://www.youtube.com/watch?v=1vbXmCrkT3Y"
    },

    {
      title: "Entrepreneurship",
      category: "Business",
      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135789.png",
      link:
        "https://www.youtube.com/watch?v=9VlvbpXwLJs"
    },

    {
      title: "Content Writing",
      category: "Writing",
      image:
        "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
      link:
        "https://www.youtube.com/watch?v=2N8r4RPvN2A"
    }

  ];

  // =========================
  // UNIQUE IDS
  // =========================

  const bigCourses = courses.map((c, i) => ({
    ...c,
    id: i + 1
  }));

  // =========================
  // SEARCH FILTER
  // =========================

  const filteredCourses =
    bigCourses.filter(course =>

      course.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      course.category
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (

    <div className="skills-page">

      <div className="skills-header">

        <h1>
          🚀 Learn More Skills
        </h1>

        <p>
          Explore top tech and non-tech courses
        </p>

        <input
          type="text"

          placeholder="Search skills or courses..."

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

          className="search-box"
        />

      </div>

      <div className="skills-grid">

        {filteredCourses.map(course => (

          <div
            key={course.id}
            className="skill-card"
          >

            <img
              src={course.image}
              alt={course.title}
            />

            <h3>
              {course.title}
            </h3>

            <span>
              {course.category}
            </span>

            <a
              href={course.link}

              target="_blank"

              rel="noreferrer"
            >
              Start Learning
            </a>

          </div>
        ))}

      </div>

    </div>
  );
}

export default LearnSkills;