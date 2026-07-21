package com.nyanpan.kudamono.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "to_be_reviewed")
public class Review {
    @Id
    private String id;

    private String name;
    private String description;
    private String imageUrl;
    private String category;
    private String source;

    public Review() {
    }

    public Review(String name, String description, String imageUrl, String category, String source) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.source = source;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
