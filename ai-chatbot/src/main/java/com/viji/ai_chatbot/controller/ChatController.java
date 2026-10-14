package com.viji.ai_chatbot.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.viji.ai_chatbot.service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
	private final ChatService chatService;

	public ChatController(ChatService chatService) {
		this.chatService = chatService;
	}

	@PostMapping
	public String chat(@RequestBody ChatRequest request) {
		return chatService.askAI(request.message(), request.conversationId());
	}

	public record ChatRequest(String message, String conversationId) {

	}

}
