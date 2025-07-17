package com.creationstack.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.dto.UserProfileResponse;
import com.creationstack.backend.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findByUserIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        UserProfileResponse.UserProfileData profileData = UserProfileResponse.UserProfileData.builder()
                .userId(user.getUserId())
                .username(user.getUserDetail().getUsername())
                .nickname(user.getUserDetail().getNickname())
                .email(user.getUserDetail().getEmail())
                .role(user.getRole())
                .jobId(user.getJob() != null ? user.getJob().getJobId() : null)
                .jobName(user.getJob() != null ? user.getJob().getName() : null)
                .bio(user.getUserDetail().getBio())
                .profileImageUrl(user.getUserDetail().getProfileImageUrl())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();

        return UserProfileResponse.builder()
                .success(true)
                .data(profileData)
                .build();
    }
}