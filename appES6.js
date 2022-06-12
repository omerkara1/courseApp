// course class
class Course {
  constructor(title, instructor, image) {
    this.courseId = Math.floor(Math.random() * 10000);
    this.title = title;
    this.instructor = instructor;
    this.image = image;
  }
}

// Uı class
class UI {
  addCourseToList(course) {
    const list = document.getElementById("course-list");

    var html = `
      <tr>
        <td> <img width="200px" height="100px" src="/img/${course.image}"/></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td> <a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a> </td>
  
      </tr>
    `;
    list.innerHTML += html;
  }

  clearControls() {
    const title = (document.getElementById("title").value = "");
    const instructor = (document.getElementById("instructor").value = "");
    const image = (document.getElementById("image").value = "");
  }

  deleteCourse(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
      return true;
    }
  }

  showAlert(message, className) {
    var alert = `
    <div class="alert alert-${className}">
        ${message}
    </div>
  `;

    const row = document.querySelector(".row");
    row.insertAdjacentHTML("beforebegin", alert);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

class Storage {
  static getCourses() {
    let courses;

    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem("courses"));
    }

    return courses;
  }

  static displayCourses() {
    const courses = Storage.getCourses();

    courses.forEach((course) => {
      const ui = new UI();
      ui.addCourseToList(course);
    });
  }

  static addCourse(course) {
    const courses = Storage.getCourses();
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
  }

  static deleteCourse(element) {
    if (element.classList.contains("delete")) {
      const id = element.getAttribute("data-id");

      const courses = Storage.getCourses();

      courses.forEach((course, index) => {
        if (course.courseId == id) {
          courses.splice(index, 1);
        }
      });

      localStorage.setItem("courses", JSON.stringify(courses));
    }
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayCourses());

// Elemanları alma
document.getElementById("new-course").addEventListener("submit", function (e) {
  const title = document.getElementById("title").value;
  const instructor = document.getElementById("instructor").value;
  const image = document.getElementById("image").value;

  // kurs objesi oluşturma
  const course = new Course(title, instructor, image);

  // UI objesi oluştruma
  const ui = new UI();

  if (title === "" || instructor === "" || image === "") {
    ui.showAlert("Lütfen formu doldurun", "warning");
  } else {
    // kursu listeye ekleme
    ui.addCourseToList(course);

    // save to ls
    Storage.addCourse(course);

    // temizleme kontrolü
    ui.clearControls();

    ui.showAlert("Kurs eklendi", "success");
  }

  e.preventDefault();
});

document.getElementById("course-list").addEventListener("click", function (e) {
  const ui = new UI();

  // delete course
  if (ui.deleteCourse(e.target) == true) {
    // delete from ls
    Storage.deleteCourse(e.target);
    ui.showAlert("Kurs silindi", "danger");
  }
});
