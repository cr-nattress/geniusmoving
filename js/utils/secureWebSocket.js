/**
 * Secure WebSocket utility module
 * 
 * This module provides secure WebSocket connection handling with proper authentication
 * and message validation based on our previous experience with Deepgram WebSocket integration.
 */

/**
 * Creates a secure WebSocket connection with proper authentication
 * @param {string} url - WebSocket server URL
 * @param {Object} options - Connection options
 * @param {string} options.apiKey - API key for authentication
 * @param {Function} options.onMessage - Message handler function
 * @param {Function} options.onError - Error handler function
 * @param {Function} options.onOpen - Connection open handler function
 * @param {Function} options.onClose - Connection close handler function
 * @returns {WebSocket} - The WebSocket connection
 */
export function createSecureWebSocket(url, options = {}) {
  // Ensure URL uses secure WebSocket protocol
  const secureUrl = url.replace(/^ws:/i, 'wss:');
  
  // Create connection
  const socket = new WebSocket(secureUrl);
  
  // Track connection state
  let isAuthenticated = false;
  let connectionEstablished = false;
  
  // Set up event handlers
  socket.addEventListener('open', (event) => {
    connectionEstablished = true;
    console.log('WebSocket connection established');
    
    // Send authentication message immediately after connection
    if (options.apiKey) {
      // Based on our experience with Deepgram, send auth as a JSON message
      // rather than in the connection URL
      const authMessage = JSON.stringify({ token: options.apiKey });
      socket.send(authMessage);
      console.log('Authentication message sent');
    }
    
    if (typeof options.onOpen === 'function') {
      options.onOpen(event);
    }
  });
  
  socket.addEventListener('message', (event) => {
    try {
      // Parse and validate incoming message
      const data = JSON.parse(event.data);
      
      // Check for authentication response
      if (data.type === 'AuthenticationSuccess' || data.status === 'success') {
        isAuthenticated = true;
        console.log('WebSocket authentication successful');
      }
      
      // Process message with sanitization
      const sanitizedData = sanitizeWebSocketData(data);
      
      if (typeof options.onMessage === 'function') {
        options.onMessage(sanitizedData, event);
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
      
      if (typeof options.onError === 'function') {
        options.onError(error);
      }
    }
  });
  
  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
    
    if (typeof options.onError === 'function') {
      options.onError(error);
    }
  });
  
  socket.addEventListener('close', (event) => {
    connectionEstablished = false;
    isAuthenticated = false;
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    if (typeof options.onClose === 'function') {
      options.onClose(event);
    }
  });
  
  // Return socket with additional utility methods
  return {
    socket,
    
    /**
     * Sends data through the WebSocket connection
     * @param {Object|string} data - Data to send
     * @returns {boolean} - Whether the send was successful
     */
    send(data) {
      if (!connectionEstablished) {
        console.error('Cannot send: WebSocket not connected');
        return false;
      }
      
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        socket.send(message);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    },
    
    /**
     * Closes the WebSocket connection
     * @param {number} code - Close code
     * @param {string} reason - Close reason
     */
    close(code = 1000, reason = 'Normal closure') {
      if (connectionEstablished) {
        socket.close(code, reason);
      }
    },
    
    /**
     * Checks if the WebSocket is connected
     * @returns {boolean} - Connection status
     */
    isConnected() {
      return connectionEstablished && socket.readyState === WebSocket.OPEN;
    },
    
    /**
     * Checks if the WebSocket is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated() {
      return isAuthenticated;
    }
  };
}

/**
 * Sanitizes WebSocket data to prevent security issues
 * @param {Object} data - The data to sanitize
 * @returns {Object} - Sanitized data
 */
function sanitizeWebSocketData(data) {
  // If data is not an object, return empty object
  if (typeof data !== 'object' || data === null) {
    return {};
  }
  
  // Create a new object with only allowed properties
  const sanitized = {};
  
  // Define allowed properties based on message type
  // This should be customized based on your API's expected format
  const allowedProps = {
    // Common properties
    common: ['id', 'type', 'status', 'timestamp'],
    // Auth-related properties
    auth: ['token', 'authenticated', 'session'],
    // Data-related properties
    data: ['content', 'payload', 'message', 'data']
  };
  
  // Copy allowed common properties
  allowedProps.common.forEach(prop => {
    if (data[prop] !== undefined) {
      sanitized[prop] = data[prop];
    }
  });
  
  // Copy allowed properties based on message type
  if (data.type === 'auth' || data.type === 'authentication') {
    allowedProps.auth.forEach(prop => {
      if (data[prop] !== undefined) {
        sanitized[prop] = data[prop];
      }
    });
  } else if (data.type === 'data' || data.type === 'message') {
    allowedProps.data.forEach(prop => {
      if (data[prop] !== undefined) {
        sanitized[prop] = data[prop];
      }
    });
  }
  
  return sanitized;
}

/**
 * Creates a secure WebSocket connection specifically for Deepgram
 * @param {string} url - Deepgram WebSocket URL
 * @param {string} apiKey - Deepgram API key
 * @param {Object} options - Additional options
 * @returns {Object} - WebSocket connection with helper methods
 */
export function createDeepgramWebSocket(url, apiKey, options = {}) {
  // Based on our previous experience with Deepgram WebSocket connections
  return createSecureWebSocket(url, {
    apiKey,
    onOpen: (event) => {
      console.log('Deepgram WebSocket connection opened');
      if (options.onOpen) options.onOpen(event);
    },
    onMessage: (data, event) => {
      // Handle Deepgram-specific message format
      if (options.onMessage) options.onMessage(data, event);
    },
    onError: (error) => {
      console.error('Deepgram WebSocket error:', error);
      if (options.onError) options.onError(error);
    },
    onClose: (event) => {
      console.log('Deepgram WebSocket connection closed');
      if (options.onClose) options.onClose(event);
    }
  });
}
