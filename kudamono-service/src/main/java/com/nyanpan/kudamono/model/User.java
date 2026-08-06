package com.nyanpan.kudamono.model;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    @Field("username")
    private String username;
    @Field("password")
    private String password;
    @Field("favourites")
    private Set<String> favourites = new HashSet<>();
    private Set<String> roles;

    @CreatedDate
    private Instant createdAt;

    public User() {}

    public User(String username, String password, Set<String> favourites, Set<String> roles, Instant createdAt) {
        this.username = username;
        this.password = password;
        this.favourites = favourites;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }
    
    public Set<String> getFavourites() {
        return favourites;
    }

    public void setFavourites(Set<String> favourites) {
        this.favourites = favourites;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

}
