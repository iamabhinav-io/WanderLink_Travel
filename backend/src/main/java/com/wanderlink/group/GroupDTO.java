package com.wanderlink.group;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTOs for Travel Group operations.
 * Response fields aligned with communityService.js normalizeGroup().
 */
public class GroupDTO {

    public static class CreateRequest {
        @NotBlank(message = "Group name is required")
        @Size(max = 150, message = "Group name cannot exceed 150 characters")
        private String name;

        @NotBlank(message = "Destination is required")
        @Size(max = 100, message = "Destination cannot exceed 100 characters")
        private String destination;

        private String description;

        @NotNull(message = "Creator user ID is required")
        private Long createdBy;

        public CreateRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCreatedBy() { return createdBy; }
        public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    }

    public static class JoinRequest {
        private Long userId;

        public JoinRequest() {}
        public JoinRequest(Long userId) { this.userId = userId; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    /**
     * Response aligned with communityService.js normalizeGroup() field names.
     */
    public static class Response {
        private Long id;
        private String name;
        private String groupName;
        private String destination;
        private String city;
        private String description;
        private Long createdById;
        private String createdByName;
        private String organizer;
        private Integer memberCount;
        private Integer maxMembers;
        private String imageUrl;
        private String category;
        private Boolean success;
        private String message;

        public Response() {}

        public Response(Long id, String name, String destination, String description,
                        Long createdById, String createdByName, Integer memberCount) {
            this.id = id;
            this.name = name;
            this.groupName = name;
            this.destination = destination;
            this.city = destination;
            this.description = description;
            this.createdById = createdById;
            this.createdByName = createdByName;
            this.organizer = createdByName;
            this.memberCount = memberCount;
            this.maxMembers = 150;
            this.imageUrl = "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80";
            this.category = "Travel Tribe";
            this.success = true;
            this.message = "Group retrieved successfully";
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; this.groupName = name; }

        public String getGroupName() { return groupName != null ? groupName : name; }
        public void setGroupName(String groupName) { this.groupName = groupName; }

        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; this.city = destination; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Long getCreatedById() { return createdById; }
        public void setCreatedById(Long createdById) { this.createdById = createdById; }

        public String getCreatedByName() { return createdByName; }
        public void setCreatedByName(String createdByName) { this.createdByName = createdByName; this.organizer = createdByName; }

        public String getOrganizer() { return organizer; }
        public void setOrganizer(String organizer) { this.organizer = organizer; }

        public Integer getMemberCount() { return memberCount; }
        public void setMemberCount(Integer memberCount) { this.memberCount = memberCount; }

        public Integer getMaxMembers() { return maxMembers; }
        public void setMaxMembers(Integer maxMembers) { this.maxMembers = maxMembers; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Boolean getSuccess() { return success; }
        public void setSuccess(Boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class MemberResponse {
        private Long id;
        private Long groupId;
        private String groupName;
        private Long userId;
        private String userName;
        private LocalDateTime joinedAt;
        private Boolean success;
        private String message;

        public MemberResponse() {}

        public MemberResponse(Long id, Long groupId, String groupName, Long userId,
                              String userName, LocalDateTime joinedAt) {
            this.id = id;
            this.groupId = groupId;
            this.groupName = groupName;
            this.userId = userId;
            this.userName = userName;
            this.joinedAt = joinedAt;
            this.success = true;
            this.message = "Successfully joined group!";
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getGroupId() { return groupId; }
        public void setGroupId(Long groupId) { this.groupId = groupId; }

        public String getGroupName() { return groupName; }
        public void setGroupName(String groupName) { this.groupName = groupName; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public LocalDateTime getJoinedAt() { return joinedAt; }
        public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

        public Boolean getSuccess() { return success; }
        public void setSuccess(Boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
