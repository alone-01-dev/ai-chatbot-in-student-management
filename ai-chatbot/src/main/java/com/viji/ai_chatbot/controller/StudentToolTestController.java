package com.viji.ai_chatbot.controller;

import com.viji.ai_chatbot.tool.StudentApiTool;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudentToolTestController {

    private final StudentApiTool studentApiTool;

    public StudentToolTestController(StudentApiTool studentApiTool) {
        this.studentApiTool = studentApiTool;
    }

    @GetMapping("/api/test-student-tool")
    public String testStudentSearch(@RequestParam String name) {
        return studentApiTool.searchStudents(name);
    }
}