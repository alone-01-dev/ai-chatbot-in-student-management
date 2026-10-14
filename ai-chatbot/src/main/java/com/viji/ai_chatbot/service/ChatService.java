
package com.viji.ai_chatbot.service;


import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.stereotype.Service;

import com.viji.ai_chatbot.tool.StudentApiTool;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final StudentApiTool studentApiTool;


    public ChatService(
            ChatClient.Builder chatClientBuilder,
            ChatMemory chatMemory,
            StudentApiTool studentApiTool) {
    	this.studentApiTool = studentApiTool;
        this.chatClient = chatClientBuilder
                .defaultAdvisors(
                        MessageChatMemoryAdvisor.builder(chatMemory).build()
                )
                .build();
    }

    public String askAI(String message, String conversationId) {
        return chatClient.prompt()
                .user(message)
                .tools(studentApiTool)
                .advisors(a -> a.param(
                        ChatMemory.CONVERSATION_ID,
                        conversationId
                ))
                .call()
                .content();
    }
}
