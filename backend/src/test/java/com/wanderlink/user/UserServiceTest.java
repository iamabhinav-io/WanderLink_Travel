package com.wanderlink.user;

import com.wanderlink.common.exception.DuplicateResourceException;
import com.wanderlink.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private UserDTO.RegisterRequest registerRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        registerRequest = new UserDTO.RegisterRequest();
        registerRequest.setFullName("Aarav Sharma");
        registerRequest.setEmail("aarav@test.com");
        registerRequest.setPassword("plainPass123");
        registerRequest.setAge(26);
        registerRequest.setLocation("Mumbai");
        registerRequest.setBio("Solo traveler");
        registerRequest.setInterests("Beach, Photography");
        registerRequest.setTravelStyle("Budget");
        registerRequest.setRole("USER");

        savedUser = new User("Aarav Sharma", "aarav@test.com", "hashedPass123", 26, "Mumbai",
                "Solo traveler", "Beach, Photography", "Budget", "USER");
        savedUser.setId(1L);
    }

    @Test
    @DisplayName("Should successfully register a new user with hashed password")
    void testRegisterUserSuccess() {
        when(userRepository.existsByEmail("aarav@test.com")).thenReturn(false);
        when(passwordEncoder.encode("plainPass123")).thenReturn("hashedPass123");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDTO.Response response = userService.registerUser(registerRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Aarav Sharma", response.getFullName());
        assertEquals("aarav@test.com", response.getEmail());
        verify(passwordEncoder, times(1)).encode("plainPass123");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException on duplicate email registration")
    void testRegisterUserDuplicateEmail() {
        when(userRepository.existsByEmail("aarav@test.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> userService.registerUser(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when user is not found")
    void testGetUserByIdNotFound() {
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(999L));
    }
}
