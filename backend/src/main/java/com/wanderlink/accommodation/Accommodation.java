package com.wanderlink.accommodation;

import com.wanderlink.user.User;
import jakarta.persistence.*;

/**
 * Entity representing local accommodation listings provided by local hosts.
 */
@Entity
@Table(name = "accommodations")
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "location", nullable = false, length = 100)
    private String location;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "price_per_night", nullable = false)
    private Double pricePerNight;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public Accommodation() {}

    public Accommodation(User host, String title, String location, String description, Double pricePerNight, String imageUrl) {
        this.host = host;
        this.title = title;
        this.location = location;
        this.description = description;
        this.pricePerNight = pricePerNight;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getHost() {
        return host;
    }

    public void setHost(User host) {
        this.host = host;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
