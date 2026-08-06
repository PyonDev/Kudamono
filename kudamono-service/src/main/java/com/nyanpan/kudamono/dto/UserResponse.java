package com.nyanpan.kudamono.dto;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class UserResponse {
    private String id;
    private String username;
    private Set<String> favourites = new HashSet<>();
    private Instant createdAt;

    public UserResponse(String id, String username, Set<String> favourites, Instant createdAt) {
        this.id = id;
        this.username = username;
        this.favourites = favourites;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public Set<String> getFavourites() {
        return favourites;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
