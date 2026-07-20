package com.nyanpan.kudamono.controller;

import static org.hamcrest.Matchers.is;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.nyanpan.kudamono.model.User;
import com.nyanpan.kudamono.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();

        User testUser = new User();
        testUser.setUsername("admin");
        
        userRepository.save(testUser);
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    public void getUserByUsername_ShouldReturnUser_WhenUserExists() throws Exception {
        mockMvc.perform(get("/api/v1/users/admin")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username", is("admin")))
                .andExpect(jsonPath("$.favourites").isEmpty());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    public void getUserByUsername_ShouldBeCaseInsensitive() throws Exception {
        mockMvc.perform(get("/api/v1/users/aDmIn")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin")))
                .andExpect(jsonPath("$.favourites").isEmpty());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    public void addAndRemoveFavourite() throws Exception {
        mockMvc.perform(post("/api/v1/users/admin/favourites/item123")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]", is("item123")));

        mockMvc.perform(delete("/api/v1/users/admin/favourites/item123")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"USER"})
    public void getUserByUsername_ShouldReturn404_WhenUserDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/v1/users/UnknownUser")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}