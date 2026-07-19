package com.nyanpan.kudamono.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.nyanpan.kudamono.model.User;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);

    Optional<User> findByUsernameIgnoreCase(String username);
}
