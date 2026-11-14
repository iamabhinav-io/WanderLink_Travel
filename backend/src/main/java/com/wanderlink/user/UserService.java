package com.wanderlink.user;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.common.exception.DuplicateResourceException;
import com.wanderlink.common.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing user registration, authentication and profiles.
 */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user with BCrypt hashed password and unique email protection.
     */
    public UserDTO.Response registerUser(UserDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with email '" + request.getEmail() + "' already exists.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        String defaultAvatar = request.getProfileImage() != null ? request.getProfileImage() :
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

        User user = new User(
                request.getEffectiveName(),
                request.getEmail().trim().toLowerCase(),
                hashedPassword,
                request.getAge(),
                defaultAvatar,
                request.getLocation(),
                request.getBio(),
                request.getInterests(),
                request.getPreferredTravelStyle(),
                request.getRole()
        );

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    /**
     * Authenticates user credentials and returns user details.
     */
    @Transactional(readOnly = true)
    public UserDTO.Response login(UserDTO.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password.");
        }

        return mapToResponse(user);
    }

    /**
     * Retrieves all registered users.
     */
    @Transactional(readOnly = true)
    public List<UserDTO.Response> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a user by their unique ID.
     */
    @Transactional(readOnly = true)
    public UserDTO.Response getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToResponse(user);
    }

    /**
     * Updates an existing user's profile details.
     */
    public UserDTO.Response updateUser(Long id, UserDTO.UpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getProfileImage() != null && !request.getProfileImage().trim().isEmpty()) {
            user.setProfileImage(request.getProfileImage().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getInterests() != null) {
            user.setInterests(request.getInterests().trim());
        }
        if (request.getPreferredTravelStyle() != null) {
            user.setPreferredTravelStyle(request.getPreferredTravelStyle().trim());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    /**
     * Finds entity by ID (internal helper for other modules like Trip, Connection, etc.).
     */
    @Transactional(readOnly = true)
    public User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    /**
     * Maps User entity to UserDTO.Response without exposing password hash.
     */
    public UserDTO.Response mapToResponse(User user) {
        return new UserDTO.Response(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getAge(),
                user.getProfileImage(),
                user.getLocation(),
                user.getBio(),
                user.getInterests(),
                user.getPreferredTravelStyle(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}
