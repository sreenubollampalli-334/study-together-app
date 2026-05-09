
import { useState } from "react";
import "../styles/learnskills.css";

function LearnSkills() {

  const [search, setSearch] = useState("");

  const courses = [

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
    }
  ];

  // Duplicate courses to create many cards
  const bigCourses = Array(13)
    .fill(courses)
    .flat()
    .map((c, i) => ({
      ...c,
      id: i + 1
    }));

  const filteredCourses = bigCourses.filter(course =>
    course.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div className="skills-page">

      <div className="skills-header">

        <h1>🚀 Learn More Skills</h1>

        <p>
          Explore top programming and tech courses
        </p>

        <input
          type="text"
          placeholder="Search skills or courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

            <h3>{course.title}</h3>

            <span>{course.category}</span>

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

