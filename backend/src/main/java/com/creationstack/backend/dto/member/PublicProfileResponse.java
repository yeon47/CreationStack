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

    public PublicProfileResponse(Long userId, String nickname, User.UserRole role, String jobName,
                                 String bio, String profileImageUrl, boolean isActive, Number subsCount) {
        this.userId = userId;
        this.nickname = nickname;
        this.role = role;
        this.jobName = jobName;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.isActive = isActive;
        this.subsCount = subsCount != null ? subsCount.longValue() : 0L;
    }
}

