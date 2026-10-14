package com.viji.studentmanagement.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.viji.studentmanagement.model.Student;
import com.viji.studentmanagement.response.ApiResponse;
import com.viji.studentmanagement.service.StudentService;

import jakarta.validation.Valid;

@RestController
public class StudentController {

	private final StudentService studentService;

	public StudentController(StudentService studentService) {
		this.studentService=studentService;
	}

	@GetMapping("/api/hello")
	public String hello() {
		return "Hello, Student!";	
	}
    //Get all the data:
	@GetMapping("/api/students")
	public ApiResponse getAllStudent()
	{
		List<Student> students=studentService.getAllStudents();
		return new ApiResponse("Students found successfully",students);
	}
    //Get the data based on id:
	@GetMapping("/api/students/{id}")
	public ResponseEntity<?> getStudentById(@PathVariable int id) {
		Optional<Student> student=studentService.getStudentById(id);
		if(student.isPresent())
		{
			ApiResponse response=new ApiResponse("Student found successfully",student.get());
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(404).body("Student not found with id: "+id);
	}
    //Create the data:
	@PostMapping("/api/students")
	public ApiResponse saveStudent(@Valid @RequestBody Student student)
	{
		Student savedStudent= studentService.saveStudent(student);
		return new ApiResponse("Student created Successfully",savedStudent);
	}
	//Update the data based on Id:
	@PutMapping("/api/students/{id}")
	public ResponseEntity<?> updateStudent(@Valid @PathVariable int id,@RequestBody Student student)
	{
		Optional<Student> updatedStudent=studentService.updateStudent(id, student);
		if(updatedStudent.isPresent()) {
			ApiResponse response=new ApiResponse("Student updated successfully",updatedStudent.get());
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(404).body("Student not found with id: "+id);
	}
	//Delete based on id:
	@DeleteMapping("/api/students/{id}")
	public ResponseEntity<?> deleteStudent(@PathVariable int id)
	{
		boolean deleted=studentService.deleteStudent(id);
		if(deleted) {
			ApiResponse response=new ApiResponse("Student deleted successfully",null);
			return ResponseEntity.ok(response);
		}
		return ResponseEntity.status(400).body("Studet not found with id: "+id);
	}
	@GetMapping("/api/students/search")
	public ApiResponse searchStudents(@RequestParam String name) {

	    List<Student> students = studentService.searchStudents(name);

	    return new ApiResponse(
	            "Students found successfully",
	            students
	    );
	}
}
