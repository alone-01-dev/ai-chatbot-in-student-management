package com.viji.studentmanagement.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.viji.studentmanagement.model.Student;
import com.viji.studentmanagement.repository.StudentRepository;

@Service
public class StudentService {
	
	private final StudentRepository studentRepository;
	
	public StudentService(StudentRepository studentRepository) {
		this.studentRepository=studentRepository;
	}
	
	public List<Student> getAllStudents()
	{
		return studentRepository.findAll();
	}
	
	public Optional<Student> getStudentById(int id) {
		return studentRepository.findById(id);
	}
	
	public Student saveStudent(Student student)
	{
		return studentRepository.save(student);
	}
	
    public Optional<Student> updateStudent(int id,Student student)
    {
    	Optional<Student> existingStudent=studentRepository.findById(id);
    	if(existingStudent.isPresent())
    	{ 
    		Student studentToUpdate=existingStudent.get();
    		studentToUpdate.setName(student.getName());
    		studentToUpdate.setEmail(student.getEmail());
    		studentToUpdate.setAge(student.getAge());
    		studentToUpdate.setDepartment(student.getDepartment());
    		
    		return Optional.of(studentRepository.save(studentToUpdate));
    	}
    	return Optional.empty();
    }
    public boolean deleteStudent(int id)
    {
    	if(studentRepository.existsById(id)) {
    		studentRepository.deleteById(id);
    		return true;
    	}
    	return false;
    }
    public List<Student> searchStudents(String name){
    	return studentRepository.findByNameContainingIgnoreCase(name);
    }

}
