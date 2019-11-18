var batchId = 1125
var trackId = 25055

function init(){
  let studentsURL = `https://learn.co/api/v1/batches/${batchId}/tracks/${trackId}/progress`
  let lessonsURL = `https://learn.co/api/v1/batches/${batchId}/tracks/${trackId}/deployed`
  let studentsPromise = fetch(studentsURL).then(res => res.json())
  let lessonsPromise = fetch(lessonsURL).then(res => res.json())
  let donePromise = Promise.all([studentsPromise, lessonsPromise])
  donePromise.then(promiseArray => {
    let studentData = promiseArray[0].map(student => {
      student.lessons = []
      return student
    })
    let lessonsData = promiseArray[1]
    getIndividualData(studentData, lessonsData)
  })
}

function getIndividualData(studentData, lessonsData){
  let allLessonsPromises = []
  let counter = 1
  lessonsData.topics.forEach(topic => {
    topic.units.forEach(unit => {
      unit.lessons.forEach(lesson => {
        let promise = fetch(`https://learn.co/api/v1/batches/${batchId}/lessons/${lesson.node.id}`)
          .then(res => {
            console.log(`Fetched ${counter} lessons`)
            counter++
            return res.json()
          })
        allLessonsPromises.push(promise)
      })
    })
  })
  let donePromise = Promise.all(allLessonsPromises)
  donePromise.then(lessonsStudentsData => {
    compileResults(studentData, lessonsStudentsData)
  })
}

function compileResults(studentData, lessonsStudentsData){
  lessonsStudentsData.forEach(lesson => {
    lesson.students.forEach(student => {
      let studentsData = studentData.find(studentsData => studentsData.id === student.id)
      let progress
      if(student.completed_at){
        progress = `✅ `
      }else if(student.started_at && !student.completed_at){
        progress = `💪 `
      }else if(!student.started_at){
        progress = `❌ `
      }
      progress += lesson.title
      studentsData.lessons.push(progress)
    })
  })
  printStudentProgress(studentData)
}

function printStudentProgress(studentData){
  console.log("************************************************************************")
  console.log("******************************START REPORT******************************")
  console.log("************************************************************************")
  console.log("")
  studentData.forEach(student => {
    console.log(student.full_name)
    console.log("------------------------------------------------------")
    student.lessons.forEach(studentsLesson => {
      console.log("|" + studentsLesson)
    })
    console.log("------------------------------------------------------")
    console.log("")
  })
  console.log("************************************************************************")
  console.log("*******************************END REPORT*******************************")
  console.log("************************************************************************")
}

init()
