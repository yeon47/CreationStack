package com.creationstack.backend.dto.member;

import com.creationstack.backend.domain.user.User;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicProfileResponse {
    private Long userId;
    private String nickname;
    private User.UserRole role;
    private String jobName;
    private String bio;
    private String profileImageUrl;
    private boolean isActive;
    private Long subsCount;
}

