package com.wanderlink.food;

import com.wanderlink.user.User;
import jakarta.persistence.*;

/**
 * Entity representing homemade food experiences provided by local culinary hosts.
 */
@Entity
@Table(name = "food_listings")
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "cuisine", nullable = false, length = 100)
    private String cuisine;

    @Column(name = "location", nullable = false, length = 100)
    private String location;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public FoodListing() {}

    public FoodListing(User provider, String title, String cuisine, String location, Double price, String description, String imageUrl) {
        this.provider = provider;
        this.title = title;
        this.cuisine = cuisine;
        this.location = location;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
