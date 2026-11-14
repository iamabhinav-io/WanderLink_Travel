package com.wanderlink.group;

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
class GroupServiceTest {

    @Mock
    private GroupRepository groupRepository;

    @Mock
    private GroupMemberRepository groupMemberRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private GroupService groupService;

    private User user1;
    private User user2;
    private TravelGroup sampleGroup;

    @BeforeEach
    void setUp() {
        user1 = new User("Aarav", "aarav@test.com", "pass", 26, "Mumbai", "Bio", "Beach", "Budget", "USER");
        user1.setId(1L);

        user2 = new User("Priya", "priya@test.com", "pass", 24, "Pune", "Bio", "Beach", "Budget", "USER");
        user2.setId(2L);

        sampleGroup = new TravelGroup("Goa Explorers", "Goa", "Sunset beach group", user1);
        sampleGroup.setId(10L);
        sampleGroup.setMemberCount(1);
    }

    @Test
    @DisplayName("Should successfully join a group and increment member count")
    void testJoinGroupSuccess() {
        when(groupRepository.findById(10L)).thenReturn(Optional.of(sampleGroup));
        when(userService.findEntityById(2L)).thenReturn(user2);
        when(groupMemberRepository.existsByGroupIdAndUserId(10L, 2L)).thenReturn(false);

        GroupMember savedMember = new GroupMember(sampleGroup, user2);
        savedMember.setId(100L);
        when(groupMemberRepository.save(any(GroupMember.class))).thenReturn(savedMember);
        when(groupRepository.save(any(TravelGroup.class))).thenReturn(sampleGroup);

        GroupDTO.MemberResponse response = groupService.joinGroup(10L, 2L);

        assertNotNull(response);
        assertEquals(10L, response.getGroupId());
        assertEquals(2L, response.getUserId());
        assertEquals(2, sampleGroup.getMemberCount());
        verify(groupMemberRepository, times(1)).save(any(GroupMember.class));
        verify(groupRepository, times(1)).save(sampleGroup);
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when user tries to join group twice")
    void testJoinGroupDuplicate() {
        when(groupRepository.findById(10L)).thenReturn(Optional.of(sampleGroup));
        when(userService.findEntityById(2L)).thenReturn(user2);
        when(groupMemberRepository.existsByGroupIdAndUserId(10L, 2L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> groupService.joinGroup(10L, 2L));
        verify(groupMemberRepository, never()).save(any(GroupMember.class));
    }
}
