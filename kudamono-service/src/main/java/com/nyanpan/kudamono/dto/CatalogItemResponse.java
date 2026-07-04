package com.nyanpan.kudamono.dto;

public class CatalogItemResponse {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String category;
    private String source;


    public CatalogItemResponse(String id, String name, String description, String imageUrl, String category, String source) {
        this.id = id;
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

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getCategory() {
        return category;
    }

    public String getSource() {
        return source;
    }
}
