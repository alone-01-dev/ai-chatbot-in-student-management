package com.viji.ai_chatbot.tool;

import java.util.Map;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class StudentApiTool {
	 private final RestClient restClient;

	    public StudentApiTool(RestClient.Builder restClientBuilder) {
	        this.restClient = restClientBuilder
	                .baseUrl("http://localhost:8081")
	                .build();
	    }
	    @Tool(description = "Search for students by name in the Student Management system")
	    public String searchStudents(String name) {
	    	return restClient.get()
	    			.uri(uriBuilder->uriBuilder.path("/api/students/search")
	    					.queryParam("name", name)
	    					.build()).retrieve().body(String.class);
	    }

@Tool(description = "Get the complete list of all students in the Student Management system")
public String getAllStudents() {

    return restClient.get()
            .uri("/api/students")
            .retrieve()
            .body(String.class);
}
@Tool(description="Get the students by id in the Student ManagementSystem")
public String getStudentById(int id) {
	String studentData= restClient.get()
			.uri("api/students/"+id+"")
			.retrieve()
			.body(String.class);
	if(studentData !="")
	{
		return studentData;
	}
	return "No Student registered in the "+id+"";
}
@Tool(description="Update the students details based on id in the Student ManagementSystem")
public String updateStudent(int id,String name,String email,int age,String department)
{
	Map<?,?> student=Map.of(
		"name",name,
		"email",email,
		"age",age,
		"department",department
	);
	String updateStudentData=restClient.put().uri("api/students/"+id)
			.contentType(MediaType.APPLICATION_JSON)
			.body(student)
			.retrieve()
			.body(String.class);
	if(updateStudentData !=null && !updateStudentData.isBlank())
	{
		return updateStudentData;
	}
	return "No Student registered in the "+id+"";
}

@Tool(description = "Create a new student in the Student Management system")
public String createNewStudent(
        String name,
        String email,
        int age,
        String department) {

    Map<?,?> student = Map.of(
            "name", name,
            "email", email,
            "age", age,
            "department", department
    );

    String createStudentData = restClient.post()
            .uri("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .body(student)
            .retrieve()
            .body(String.class);

    if (createStudentData != null && !createStudentData.isBlank()) {
        return createStudentData;
    }

    return "Student data was submitted, but the API returned an empty response.";
}

@Tool(description = "Delete a student from the Student Management system using their ID. Only execute after the user explicitly confirms the deletion.")
public String deleteStudent(int id) {

    String deleteStudentData= restClient.delete()
            .uri("/api/students/{id}", id)
            .retrieve()
            .body(String.class);
    if(deleteStudentData !=null)
	{
		return deleteStudentData;
	}
    
	return "No Student registered in the "+id+"";
}


}
