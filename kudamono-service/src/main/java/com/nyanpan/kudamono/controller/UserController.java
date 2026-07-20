package com.nyanpan.kudamono.controller;

import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nyanpan.kudamono.model.User;
import com.nyanpan.kudamono.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{username}/favourites/{itemId}")
    public ResponseEntity<Set<String>> addFavourite(@PathVariable String username, @PathVariable String itemId) {
        return userRepository.findByUsernameIgnoreCase(username)
                .map(user -> {
                    user.getFavourites().add(itemId);
                    userRepository.save(user);
                    return ResponseEntity.ok(user.getFavourites());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{username}/favourites/{itemId}")
    public ResponseEntity<Set<String>> removeFavourite(@PathVariable String username, @PathVariable String itemId) {
        return userRepository.findByUsernameIgnoreCase(username)
                .map(user -> {
                    user.getFavourites().remove(itemId);
                    userRepository.save(user);
                    return ResponseEntity.ok(user.getFavourites());
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
