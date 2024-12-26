// Simulated course data
const courses = [
    { id: 1, title: "JavaScript for Beginners", description: "Learn JavaScript from scratch.", price: 10 },
    { id: 2, title: "HTML & CSS Mastery", description: "Master the basics of web development.", price: 20 },
    { id: 3, title: "React.js Essentials", description: "Build modern web apps with React.", price: 10 }
  ];
  
  // Populate courses on courses.html
  if (document.getElementById('course-list')) {
    const courseList = document.getElementById('course-list');
    courses.forEach(course => {
      const courseCard = document.createElement('div');
      courseCard.className = 'course-card';
      courseCard.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <p>Price: $${course.price}</p>
        <a href="course-details.html?id=${course.id}" class="button">View Details</a>
      `;
      courseList.appendChild(courseCard);
    });
  }
  
  // Load course details on course-details.html
  if (document.getElementById('course-details')) {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const course = courses.find(c => c.id == courseId);
  
    if (course) {
      const courseDetails = document.getElementById('course-details');
      courseDetails.innerHTML = `
        <h2>${course.title}</h2>
        <p>${course.description}</p>
        <p>Price: $${course.price}</p>
        <a href="courses.html" class="button">Back to Courses</a>
      `;
    } else {
      document.getElementById('course-details').innerHTML = "<p>Course not found.</p>";
    }
  }
  