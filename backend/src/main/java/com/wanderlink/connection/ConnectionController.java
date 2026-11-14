package com.wanderlink.connection;

import com.wanderlink.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Connection management.
 */
@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    /**
     * Sends a new connection request.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ConnectionDTO.Response>> sendConnection(
            @Valid @RequestBody ConnectionDTO.CreateRequest request) {
        ConnectionDTO.Response response = connectionService.sendConnection(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Connection request sent successfully", response));
    }

    /**
     * Retrieves all connections for a user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ConnectionDTO.Response>>> getConnectionsForUser(
            @PathVariable Long userId) {
        List<ConnectionDTO.Response> connections = connectionService.getConnectionsForUser(userId);
        return ResponseEntity.ok(ApiResponse.success("Connections retrieved successfully", connections));
    }

    /**
     * Accepts a connection request.
     */
    @PutMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<ConnectionDTO.Response>> acceptConnection(@PathVariable Long id) {
        ConnectionDTO.Response response = connectionService.acceptConnection(id);
        return ResponseEntity.ok(ApiResponse.success("Connection request accepted", response));
    }

    /**
     * Rejects a connection request.
     */
    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ConnectionDTO.Response>> rejectConnection(@PathVariable Long id) {
        ConnectionDTO.Response response = connectionService.rejectConnection(id);
        return ResponseEntity.ok(ApiResponse.success("Connection request rejected", response));
    }
}
