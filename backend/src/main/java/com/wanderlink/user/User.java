package com.wanderlink.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User entity representing registered travelers, community hosts, and providers.
 * Conforms strictly to Feature 1 specifications.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "age")
    private Integer age;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "interests", length = 255)
    private String interests;

    @Column(name = "preferred_travel_style", length = 50)
    private String preferredTravelStyle;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "role", length = 50)
    private String role = "USER";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    public User(String name, String email, String passwordHash, Integer age, String location,
                String bio, String interests, String preferredTravelStyle, String role) {
        this();
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.age = age;
        this.location = location;
        this.bio = bio;
        this.interests = interests;
        this.preferredTravelStyle = preferredTravelStyle;
        this.role = (role != null && !role.trim().isEmpty()) ? role : "USER";
    }

    public User(String name, String email, String passwordHash, Integer age, String profileImage,
                String location, String bio, String interests, String preferredTravelStyle, String role) {
        this(name, email, passwordHash, age, location, bio, interests, preferredTravelStyle, role);
        this.profileImage = profileImage;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
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
    }

    // Alias for fullName compatibility
    public String getFullName() {
        return name;
    }

    public void setFullName(String fullName) {
        this.name = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    // Alias for password compatibility
    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
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
    }

    // Alias for avatar compatibility
    public String getAvatar() {
        return profileImage;
    }

    public void setAvatar(String avatar) {
        this.profileImage = avatar;
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
    }

    // Alias for travelStyle compatibility
    public String getTravelStyle() {
        return preferredTravelStyle;
    }

    public void setTravelStyle(String travelStyle) {
        this.preferredTravelStyle = travelStyle;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
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
}
