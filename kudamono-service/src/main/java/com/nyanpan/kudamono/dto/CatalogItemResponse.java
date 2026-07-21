package com.nyanpan.kudamono.dto;

import java.util.Set;

public class CatalogItemResponse {
    private String id;
    private String name;
    private String series;
    private String imageUrl;
    private Set<String> tags;


    public CatalogItemResponse(String id, String name, String series, String imageUrl, Set<String> tags) {
        this.id = id;
        this.name = name;
        this.series = series;
        this.imageUrl = imageUrl;
        this.tags = tags;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSeries() {
        return series;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Set<String> getTags() {
        return tags;
    }
}
