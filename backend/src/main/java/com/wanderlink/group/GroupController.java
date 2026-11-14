package com.wanderlink.group;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GroupDTO.Response>>> getAllGroups() {
        List<GroupDTO.Response> groups = groupService.getAllGroups();
        return ResponseEntity.ok(ApiResponse.success("Travel groups retrieved successfully", groups));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GroupDTO.Response>> getGroupById(@PathVariable Long id) {
        GroupDTO.Response group = groupService.getGroupById(id);
        return ResponseEntity.ok(ApiResponse.success("Travel group retrieved successfully", group));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GroupDTO.Response>> createGroup(@Valid @RequestBody GroupDTO.CreateRequest request) {
        GroupDTO.Response response = groupService.createGroup(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Travel group created successfully", response));
    }

    /**
     * Join group. Accepts userId in body OR as query param for frontend flexibility.
     * POST /api/groups/{id}/join
     * Body: { "userId": 1 }  OR  ?userId=1
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<GroupDTO.MemberResponse>> joinGroup(
            @PathVariable Long id,
            @RequestBody(required = false) GroupDTO.JoinRequest request,
            @RequestParam(name = "userId", required = false) Long paramUserId) {

        Long effectiveUserId = null;
        if (request != null && request.getUserId() != null) {
            effectiveUserId = request.getUserId();
        } else if (paramUserId != null) {
            effectiveUserId = paramUserId;
        } else {
            effectiveUserId = 1L; // default demo user
        }

        GroupDTO.MemberResponse response = groupService.joinGroup(id, effectiveUserId);
        return ResponseEntity.ok(ApiResponse.success("Successfully joined travel group", response));
    }
}
