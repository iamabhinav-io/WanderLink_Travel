package com.wanderlink.group;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.common.exception.DuplicateResourceException;
import com.wanderlink.common.exception.ResourceNotFoundException;
import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserService userService;

    public GroupService(GroupRepository groupRepository,
                        GroupMemberRepository groupMemberRepository,
                        UserService userService) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userService = userService;
    }

    public GroupDTO.Response createGroup(GroupDTO.CreateRequest request) {
        User creator = userService.findEntityById(request.getCreatedBy());

        TravelGroup group = new TravelGroup(
                request.getName().trim(),
                request.getDestination().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                creator
        );
        group.setMemberCount(1);
        TravelGroup savedGroup = groupRepository.save(group);

        groupMemberRepository.save(new GroupMember(savedGroup, creator));
        return mapToResponse(savedGroup);
    }

    @Transactional(readOnly = true)
    public List<GroupDTO.Response> getAllGroups() {
        return groupRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GroupDTO.Response getGroupById(Long id) {
        TravelGroup group = groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TravelGroup", "id", id));
        return mapToResponse(group);
    }

    public GroupDTO.MemberResponse joinGroup(Long groupId, Long userId) {
        TravelGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("TravelGroup", "id", groupId));

        User user = userService.findEntityById(userId);

        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new DuplicateResourceException("User is already a member of this travel group.");
        }

        GroupMember newMember = new GroupMember(group, user);
        GroupMember savedMember = groupMemberRepository.save(newMember);

        group.setMemberCount(group.getMemberCount() + 1);
        groupRepository.save(group);

        return new GroupDTO.MemberResponse(
                savedMember.getId(),
                group.getId(),
                group.getName(),
                user.getId(),
                user.getName(),
                savedMember.getJoinedAt()
        );
    }

    public GroupDTO.Response mapToResponse(TravelGroup group) {
        User creator = group.getCreatedBy();
        return new GroupDTO.Response(
                group.getId(),
                group.getName(),
                group.getDestination(),
                group.getDescription(),
                creator.getId(),
                creator.getName(),
                group.getMemberCount()
        );
    }
}
