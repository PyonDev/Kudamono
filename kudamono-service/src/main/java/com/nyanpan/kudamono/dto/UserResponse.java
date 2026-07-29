package com.nyanpan.kudamono.dto;

import java.util.HashSet;
import java.util.Set;

public class UserResponse {
    private String id;
    private String username;
    private Set<String> favourites = new HashSet<>();

    public UserResponse(String id, String username, Set<String> favourites) {
        this.id = id;
        this.username = username;
        this.favourites = favourites;
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
}
