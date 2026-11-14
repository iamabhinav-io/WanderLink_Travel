package com.wanderlink.connection;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.common.exception.DuplicateResourceException;
import com.wanderlink.common.exception.ResourceNotFoundException;
import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service managing travel buddy connection requests.
 */
@Service
@Transactional
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserService userService;

    public ConnectionService(ConnectionRepository connectionRepository, UserService userService) {
        this.connectionRepository = connectionRepository;
        this.userService = userService;
    }

    /**
     * Sends a new connection request to another traveler.
     */
    public ConnectionDTO.Response sendConnection(ConnectionDTO.CreateRequest request) {
        if (request.getSenderId().equals(request.getReceiverId())) {
            throw new BadRequestException("You cannot send a connection request to yourself.");
        }

        User sender = userService.findEntityById(request.getSenderId());
        User receiver = userService.findEntityById(request.getReceiverId());

        if (connectionRepository.findPendingBetweenUsers(sender.getId(), receiver.getId()).isPresent()) {
            throw new DuplicateResourceException("A pending connection request already exists between these travelers.");
        }

        Connection connection = new Connection(sender, receiver);
        Connection saved = connectionRepository.save(connection);

        return mapToResponse(saved);
    }

    /**
     * Retrieves all connections (pending, accepted, rejected) involving a user.
     */
    @Transactional(readOnly = true)
    public List<ConnectionDTO.Response> getConnectionsForUser(Long userId) {
        // Validate user existence
        userService.findEntityById(userId);

        return connectionRepository.findAllForUser(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Accepts a pending connection request.
     */
    public ConnectionDTO.Response acceptConnection(Long id) {
        Connection connection = connectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Connection", "id", id));

        if (connection.getStatus() != Connection.Status.PENDING) {
            throw new BadRequestException("Cannot accept connection in status: " + connection.getStatus());
        }

        connection.setStatus(Connection.Status.ACCEPTED);
        Connection updated = connectionRepository.save(connection);
        return mapToResponse(updated);
    }

    /**
     * Rejects a pending connection request.
     */
    public ConnectionDTO.Response rejectConnection(Long id) {
        Connection connection = connectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Connection", "id", id));

        if (connection.getStatus() != Connection.Status.PENDING) {
            throw new BadRequestException("Cannot reject connection in status: " + connection.getStatus());
        }

        connection.setStatus(Connection.Status.REJECTED);
        Connection updated = connectionRepository.save(connection);
        return mapToResponse(updated);
    }

    /**
     * Maps Connection entity to ConnectionDTO.Response.
     */
    public ConnectionDTO.Response mapToResponse(Connection connection) {
        User sender = connection.getSender();
        User receiver = connection.getReceiver();

        return new ConnectionDTO.Response(
                connection.getId(),
                sender.getId(),
                sender.getFullName(),
                sender.getLocation(),
                receiver.getId(),
                receiver.getFullName(),
                receiver.getLocation(),
                connection.getStatus().name(),
                connection.getCreatedAt()
        );
    }
}
