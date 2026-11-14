package com.wanderlink.guide;

import jakarta.persistence.*;

/**
 * Entity representing a certified local guide.
 */
@Entity
@Table(name = "guides")
public class Guide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "location", nullable = false, length = 100)
    private String location;

    @Column(name = "profile_image", length = 500)
    private String profileImage;

    @Column(name = "languages", length = 255)
    private String languages;

    @Column(name = "experience", length = 100)
    private String experience;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "price")
    private Double price;

    @Column(name = "specialties", length = 500)
    private String specialties;

    @Column(name = "bio", length = 500)
    private String bio;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "reviews_count")
    private Integer reviewsCount;

    @Column(name = "verified")
    private Boolean verified = true;

    public Guide() {}

    public Guide(String name, String location, String profileImage, String languages,
                 String experience, Integer experienceYears, Double price,
                 String specialties, String bio, String contactPhone) {
        this.name = name;
        this.location = location;
        this.profileImage = profileImage;
        this.languages = languages;
        this.experience = experience;
        this.experienceYears = experienceYears;
        this.price = price;
        this.specialties = specialties;
        this.bio = bio;
        this.contactPhone = contactPhone;
        this.rating = 4.9;
        this.reviewsCount = 45;
        this.verified = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public String getAvatar() { return profileImage; }

    public String getLanguages() { return languages; }
    public void setLanguages(String languages) { this.languages = languages; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Double getPricePerDay() { return price; }

    public String getSpecialties() { return specialties; }
    public void setSpecialties(String specialties) { this.specialties = specialties; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getPhone() { return contactPhone; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewsCount() { return reviewsCount; }
    public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
}
