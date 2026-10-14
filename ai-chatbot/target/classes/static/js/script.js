/* =====================================================
   GET HTML ELEMENTS
===================================================== */
const conversationId = crypto.randomUUID();

const messageInput = document.getElementById("messageInput");

const sendButton = document.getElementById("sendButton");

const sendButtonText = document.getElementById("sendButtonText");

const chatBox = document.getElementById("chatBox");

const clearButton = document.getElementById("clearButton");


/* =====================================================
   EVENT LISTENERS
===================================================== */

// Send button
sendButton.addEventListener("click", sendMessage);


// Enter key
messageInput.addEventListener("keydown", function(event) {

	if (event.key === "Enter") {

		event.preventDefault();

		sendMessage();

	}

});


// Clear chat
clearButton.addEventListener("click", clearChat);


/* =====================================================
   SEND MESSAGE
===================================================== */

async function sendMessage() {

	const message = messageInput.value.trim();


	// Don't send empty message
	if (message === "") {

		return;

	}


	/* ---------------------------------------------
	   SHOW USER MESSAGE
	--------------------------------------------- */

	addUserMessage(message);


	// Clear input
	messageInput.value = "";


	/* ---------------------------------------------
	   DISABLE SEND BUTTON
	--------------------------------------------- */

	setLoading(true);


	/* ---------------------------------------------
	   SHOW THINKING INDICATOR
	--------------------------------------------- */

	const thinkingMessage = addThinkingMessage();


	try {

		/* -----------------------------------------
		   SEND REQUEST TO SPRING BOOT
		----------------------------------------- */
		console.log("Conversation ID:", conversationId);
		const response = await fetch("/api/chat", {

			method: "POST",

			headers: {

				"Content-Type": "application/json"

			},

			body: JSON.stringify({

				message: message,
				conversationId: conversationId

			})

		});


		/* -----------------------------------------
		   CHECK RESPONSE
		----------------------------------------- */

		if (!response.ok) {

			throw new Error(
				"Server error: " + response.status
			);

		}


		/* -----------------------------------------
		   GET AI RESPONSE
		----------------------------------------- */

		const aiResponse = await response.text();


		/* -----------------------------------------
		   REMOVE THINKING INDICATOR
		----------------------------------------- */

		thinkingMessage.remove();


		/* -----------------------------------------
		   SHOW AI RESPONSE
		----------------------------------------- */

		addAIMessage(aiResponse);


	} catch (error) {

		console.error("Chat error:", error);


		// Remove thinking indicator
		thinkingMessage.remove();


		// Show error message
		addAIMessage(
			"Sorry 😔 Something went wrong. Please try again."
		);

	}


	/* ---------------------------------------------
	   ENABLE SEND BUTTON
	--------------------------------------------- */

	setLoading(false);


	// Focus input again
	messageInput.focus();

}


/* =====================================================
   ADD USER MESSAGE
===================================================== */

function addUserMessage(message) {

	const messageElement = document.createElement("div");

	messageElement.classList.add(
		"message",
		"user-message"
	);


	messageElement.innerHTML = `

        <div class="message-avatar">
            👤
        </div>

        <div class="message-content">

            <div class="message-name">
                You
            </div>

            <div class="message-text"></div>

        </div>

    `;


	// Safely insert user text
	messageElement
		.querySelector(".message-text")
		.textContent = message;


	chatBox.appendChild(messageElement);


	scrollToBottom();

}


/* =====================================================
   ADD AI MESSAGE
===================================================== */

function addAIMessage(message) {

	const messageElement = document.createElement("div");

	messageElement.classList.add(
		"message",
		"ai-message"
	);


	messageElement.innerHTML = `

        <div class="message-avatar">
            🤖
        </div>

        <div class="message-content">

            <div class="message-name">
                AI
            </div>

            <div class="message-text"></div>

        </div>

    `;


	// Safely insert AI response
	messageElement
		.querySelector(".message-text")
		.textContent = message;


	chatBox.appendChild(messageElement);


	scrollToBottom();

}


/* =====================================================
   THINKING MESSAGE
===================================================== */

function addThinkingMessage() {

	const messageElement = document.createElement("div");

	messageElement.classList.add(
		"message",
		"ai-message"
	);


	messageElement.innerHTML = `

        <div class="message-avatar">
            🤖
        </div>

        <div class="message-content">

            <div class="message-name">
                AI
            </div>

            <div class="thinking-dots">

                <span></span>
                <span></span>
                <span></span>

            </div>

        </div>

    `;


	chatBox.appendChild(messageElement);


	scrollToBottom();


	return messageElement;

}


/* =====================================================
   LOADING STATE
===================================================== */

function setLoading(isLoading) {

	if (isLoading) {

		// Disable button
		sendButton.disabled = true;


		// Change button text
		sendButtonText.textContent = "Thinking...";


		// Disable input
		messageInput.disabled = true;

	} else {

		// Enable button
		sendButton.disabled = false;


		// Restore button text
		sendButtonText.textContent = "Send";


		// Enable input
		messageInput.disabled = false;

	}

}


/* =====================================================
   CLEAR CHAT
===================================================== */

function clearChat() {

	// Ask for confirmation
	const confirmed = confirm(
		"Are you sure you want to clear the chat?"
	);


	if (!confirmed) {

		return;

	}


	// Clear all messages
	chatBox.innerHTML = "";


	// Add welcome message again
	addAIMessage(
		"Hello! 👋\nI'm your AI assistant. How can I help you today?"
	);


	// Focus input
	messageInput.focus();

}


/* =====================================================
   SCROLL TO BOTTOM
===================================================== */

function scrollToBottom() {

	chatBox.scrollTop = chatBox.scrollHeight;

}