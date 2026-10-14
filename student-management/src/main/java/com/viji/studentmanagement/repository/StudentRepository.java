package com.viji.studentmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.viji.studentmanagement.model.Student;

public interface StudentRepository extends JpaRepository<Student,Integer> {
	
	List<Student> findByNameContainingIgnoreCase(String name);

}
