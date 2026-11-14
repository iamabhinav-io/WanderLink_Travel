package com.wanderlink.connection;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

/**
 * Data Transfer Objects for Connection operations.
 */
public class ConnectionDTO {

    /**
     * Request payload to send a connection invitation.
     */
    public static class CreateRequest {
        @NotNull(message = "Sender ID is required")
        private Long senderId;

        @NotNull(message = "Receiver ID is required")
        private Long receiverId;

        public CreateRequest() {}

        public CreateRequest(Long senderId, Long receiverId) {
            this.senderId = senderId;
            this.receiverId = receiverId;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }
    }

    /**
     * Response payload representing connection status and details.
     */
    public static class Response {
        private Long id;
        private Long senderId;
        private String senderName;
        private String senderLocation;
        private Long receiverId;
        private String receiverName;
        private String receiverLocation;
        private String status;
        private LocalDateTime createdAt;

        public Response() {}

        public Response(Long id, Long senderId, String senderName, String senderLocation,
                        Long receiverId, String receiverName, String receiverLocation,
                        String status, LocalDateTime createdAt) {
            this.id = id;
            this.senderId = senderId;
            this.senderName = senderName;
            this.senderLocation = senderLocation;
            this.receiverId = receiverId;
            this.receiverName = receiverName;
            this.receiverLocation = receiverLocation;
            this.status = status;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public String getSenderName() {
            return senderName;
        }

        public void setSenderName(String senderName) {
            this.senderName = senderName;
        }

        public String getSenderLocation() {
            return senderLocation;
        }

        public void setSenderLocation(String senderLocation) {
            this.senderLocation = senderLocation;
        }

        public Long getReceiverId() {
            return receiverId;
        }

        public void setReceiverId(Long receiverId) {
            this.receiverId = receiverId;
        }

        public String getReceiverName() {
            return receiverName;
        }

        public void setReceiverName(String receiverName) {
            this.receiverName = receiverName;
        }

        public String getReceiverLocation() {
            return receiverLocation;
        }

        public void setReceiverLocation(String receiverLocation) {
            this.receiverLocation = receiverLocation;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
