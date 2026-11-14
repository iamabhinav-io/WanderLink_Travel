package com.wanderlink.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * Data Transfer Objects for User operations.
 */
public class UserDTO {

    /**
     * Request payload for user registration.
     */
    public static class RegisterRequest {
        @Size(max = 100, message = "Name cannot exceed 100 characters")
        private String name;

        @Size(max = 100, message = "Full name cannot exceed 100 characters")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid email address")
        @Size(max = 150, message = "Email cannot exceed 150 characters")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        @Positive(message = "Age must be a positive number")
        private Integer age;

        private String profileImage;
        private String avatar;
        private String location;
        private String bio;
        private String interests;
        private String preferredTravelStyle;
        private String travelStyle;
        private String role;

        public RegisterRequest() {}

        public String getEffectiveName() {
            if (name != null && !name.trim().isEmpty()) {
                return name.trim();
            }
            if (fullName != null && !fullName.trim().isEmpty()) {
                return fullName.trim();
            }
            return "WanderLink Traveler";
        }

        public String getName() {
            return name != null ? name : fullName;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFullName() {
            return fullName != null ? fullName : name;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getProfileImage() {
            return profileImage != null ? profileImage : avatar;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }

        public String getAvatar() {
            return avatar != null ? avatar : profileImage;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }

        public String getInterests() {
            return interests;
        }

        public void setInterests(String interests) {
            this.interests = interests;
        }

        public String getPreferredTravelStyle() {
            return preferredTravelStyle != null ? preferredTravelStyle : travelStyle;
        }

        public void setPreferredTravelStyle(String preferredTravelStyle) {
            this.preferredTravelStyle = preferredTravelStyle;
        }

        public String getTravelStyle() {
            return travelStyle != null ? travelStyle : preferredTravelStyle;
        }

        public void setTravelStyle(String travelStyle) {
            this.travelStyle = travelStyle;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    /**
     * Request payload for user login.
     */
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be a valid email address")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    /**
     * Request payload for updating a user profile.
     */
    public static class UpdateRequest {
        private String name;
        private String fullName;
        private Integer age;
        private String profileImage;
        private String avatar;
        private String location;
        private String bio;
        private String interests;
        private String preferredTravelStyle;
        private String travelStyle;

        public UpdateRequest() {}

        public String getName() {
            return name != null ? name : fullName;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getFullName() {
            return fullName != null ? fullName : name;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getProfileImage() {
            return profileImage != null ? profileImage : avatar;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
        }

        public String getAvatar() {
            return avatar != null ? avatar : profileImage;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }

        public String getInterests() {
            return interests;
        }

        public void setInterests(String interests) {
            this.interests = interests;
        }

        public String getPreferredTravelStyle() {
            return preferredTravelStyle != null ? preferredTravelStyle : travelStyle;
        }

        public void setPreferredTravelStyle(String preferredTravelStyle) {
            this.preferredTravelStyle = preferredTravelStyle;
        }

        public String getTravelStyle() {
            return travelStyle != null ? travelStyle : preferredTravelStyle;
        }

        public void setTravelStyle(String travelStyle) {
            this.travelStyle = travelStyle;
        }
    }

    /**
     * Response representation of a User.
     * Never contains the password hash.
     */
    public static class Response {
        private Long id;
        private String name;
        private String fullName;
        private String email;
        private Integer age;
        private String profileImage;
        private String avatar;
        private String location;
        private String bio;
        private String interests;
        private String preferredTravelStyle;
        private String travelStyle;
        private String role;
        private LocalDateTime createdAt;
        private String token;

        public Response() {}

        public Response(Long id, String name, String email, Integer age, String profileImage,
                        String location, String bio, String interests, String preferredTravelStyle,
                        String role, LocalDateTime createdAt) {
            this.id = id;
            this.name = name;
            this.fullName = name;
            this.email = email;
            this.age = age;
            this.profileImage = profileImage;
            this.avatar = profileImage;
            this.location = location;
            this.bio = bio;
            this.interests = interests;
            this.preferredTravelStyle = preferredTravelStyle;
            this.travelStyle = preferredTravelStyle;
            this.role = role;
            this.createdAt = createdAt;
            this.token = "wanderlink-demo-token-" + id;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
            this.fullName = name;
        }

        public String getFullName() {
            return fullName != null ? fullName : name;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
            this.name = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Integer getAge() {
            return age;
        }

        public void setAge(Integer age) {
            this.age = age;
        }

        public String getProfileImage() {
            return profileImage;
        }

        public void setProfileImage(String profileImage) {
            this.profileImage = profileImage;
            this.avatar = profileImage;
        }

        public String getAvatar() {
            return avatar != null ? avatar : profileImage;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
            this.profileImage = avatar;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }

        public String getInterests() {
            return interests;
        }

        public void setInterests(String interests) {
            this.interests = interests;
        }

        public String getPreferredTravelStyle() {
            return preferredTravelStyle;
        }

        public void setPreferredTravelStyle(String preferredTravelStyle) {
            this.preferredTravelStyle = preferredTravelStyle;
            this.travelStyle = preferredTravelStyle;
        }

        public String getTravelStyle() {
            return travelStyle != null ? travelStyle : preferredTravelStyle;
        }

        public void setTravelStyle(String travelStyle) {
            this.travelStyle = travelStyle;
            this.preferredTravelStyle = travelStyle;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
    }
}
