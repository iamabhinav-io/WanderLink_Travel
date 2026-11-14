package com.wanderlink.connection;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.common.exception.DuplicateResourceException;
import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {

    @Mock
    private ConnectionRepository connectionRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ConnectionService connectionService;

    private User sender;
    private User receiver;
    private Connection sampleConnection;

    @BeforeEach
    void setUp() {
        sender = new User("Aarav", "aarav@test.com", "pass", 26, "Mumbai", "Bio", "Beach", "Budget", "USER");
        sender.setId(1L);

        receiver = new User("Priya", "priya@test.com", "pass", 24, "Pune", "Bio", "Beach", "Budget", "USER");
        receiver.setId(2L);

        sampleConnection = new Connection(sender, receiver);
        sampleConnection.setId(10L);
    }

    @Test
    @DisplayName("Should successfully send a connection request")
    void testSendConnectionSuccess() {
        when(userService.findEntityById(1L)).thenReturn(sender);
        when(userService.findEntityById(2L)).thenReturn(receiver);
        when(connectionRepository.findPendingBetweenUsers(1L, 2L)).thenReturn(Optional.empty());
        when(connectionRepository.save(any(Connection.class))).thenReturn(sampleConnection);

        ConnectionDTO.CreateRequest request = new ConnectionDTO.CreateRequest(1L, 2L);
        ConnectionDTO.Response response = connectionService.sendConnection(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("PENDING", response.getStatus());
        verify(connectionRepository, times(1)).save(any(Connection.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when sending request to self")
    void testSendConnectionToSelf() {
        ConnectionDTO.CreateRequest request = new ConnectionDTO.CreateRequest(1L, 1L);

        assertThrows(BadRequestException.class, () -> connectionService.sendConnection(request));
        verify(connectionRepository, never()).save(any(Connection.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when duplicate pending request exists")
    void testSendConnectionDuplicate() {
        when(userService.findEntityById(1L)).thenReturn(sender);
        when(userService.findEntityById(2L)).thenReturn(receiver);
        when(connectionRepository.findPendingBetweenUsers(1L, 2L)).thenReturn(Optional.of(sampleConnection));

        ConnectionDTO.CreateRequest request = new ConnectionDTO.CreateRequest(1L, 2L);

        assertThrows(DuplicateResourceException.class, () -> connectionService.sendConnection(request));
        verify(connectionRepository, never()).save(any(Connection.class));
    }

    @Test
    @DisplayName("Should accept a pending connection")
    void testAcceptConnection() {
        when(connectionRepository.findById(10L)).thenReturn(Optional.of(sampleConnection));
        when(connectionRepository.save(any(Connection.class))).thenReturn(sampleConnection);

        ConnectionDTO.Response response = connectionService.acceptConnection(10L);

        assertNotNull(response);
        assertEquals(Connection.Status.ACCEPTED.name(), response.getStatus());
    }

    @Test
    @DisplayName("Should reject a pending connection")
    void testRejectConnection() {
        when(connectionRepository.findById(10L)).thenReturn(Optional.of(sampleConnection));
        when(connectionRepository.save(any(Connection.class))).thenReturn(sampleConnection);

        ConnectionDTO.Response response = connectionService.rejectConnection(10L);

        assertNotNull(response);
        assertEquals(Connection.Status.REJECTED.name(), response.getStatus());
    }
}
