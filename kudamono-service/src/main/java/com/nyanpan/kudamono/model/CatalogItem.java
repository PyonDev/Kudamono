package com.nyanpan.kudamono.model;

import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "catalog_items")
public class CatalogItem {
    @Id
    private String id;

    private String name;
    private String series;
    private String imageUrl;
    private Set<String> tags;

    public CatalogItem() {
    }

    public CatalogItem(String name, String series, String imageUrl, Set<String> tags) {
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

    public void setName(String name) {
        this.name = name;
    }

    public String getSeries() {
        return series;
    }

    public void setDescription(String series) {
        this.series = series;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
        this.tags = tags;
    }

}
