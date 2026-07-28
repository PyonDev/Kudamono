package com.nyanpan.kudamono.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nyanpan.kudamono.dto.UserResponse;
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
            item.getUsername()
        )).collect(Collectors.toList());
    }
}
