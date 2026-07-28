package com.nyanpan.kudamono.dto;

public class UserResponse {
    private String id;
    private String username;

    public UserResponse(String id, String username) {
        this.id = id;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}
