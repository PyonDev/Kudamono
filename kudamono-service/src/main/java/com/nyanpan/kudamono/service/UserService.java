package com.nyanpan.kudamono.service;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.nyanpan.kudamono.dto.UserResponse;
import com.nyanpan.kudamono.model.User;
import com.nyanpan.kudamono.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;


    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    

    public List<UserResponse> getAllCatalogItems() {
        return userRepository.findAll().stream()
        .map(item -> new UserResponse(
            item.getId(),
            item.getUsername(),
            item.getFavourites()
        )).collect(Collectors.toList());
    }

    public Set<String> getUserFavourites(String username) {
        return userRepository.findByUsername(username)
            .map(user -> user.getFavourites())
            .orElse(Collections.emptySet());
    }

    public User updateUserName(String username, String newUsername) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (userRepository.existsByUsername(newUsername)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already exists");
        }
        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
    }
}
