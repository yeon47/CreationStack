package com.creationstack.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creationstack.backend.domain.user.Job;
import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.domain.user.UserDetail;
import com.creationstack.backend.dto.member.PublicProfileResponse;
import com.creationstack.backend.dto.member.UpdateProfileRequest;
import com.creationstack.backend.dto.member.UserProfileResponse;
import com.creationstack.backend.exception.CustomException;
import com.creationstack.backend.repository.JobRepository;
import com.creationstack.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

        private final UserRepository userRepository;
        private final JobRepository jobRepository;
        private final PasswordEncoder passwordEncoder;

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

        public PublicProfileResponse getPublicProfile(String nickname) {
                User user = userRepository.findByUserDetailNickname(nickname)
                                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND,
                                                "해당 닉네임의 사용자를 찾을 수 없습니다."));

                return PublicProfileResponse.builder()
                                .userId(user.getUserId())
                                .nickname(nickname)
                                .role(user.getRole())
                                .jobName(user.getJob() != null ? user.getJob().getName() : null)
                                .bio(user.getUserDetail().getBio())
                                .profileImageUrl(user.getUserDetail().getProfileImageUrl())
                                .isActive(user.getIsActive())
                                .build();
        }

        @Transactional
        public void updateUserProfile(Long userId, UpdateProfileRequest request) {
                User user = userRepository.findByUserIdAndIsActiveTrue(userId)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                UserDetail userDetail = user.getUserDetail();

                String currentPassword = request.getCurrentPassword();
                if (currentPassword == null || currentPassword.isEmpty()) {
                        throw new IllegalArgumentException("프로필을 수정하려면 현재 비밀번호를 입력해야 합니다.");
                }
                if (!passwordEncoder.matches(currentPassword, userDetail.getPassword())) {
                        throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
                }

                if (request.getNickname() != null && !request.getNickname().isEmpty()) {
                        userDetail.setNickname(request.getNickname());
                }
                if (request.getBio() != null) {
                        userDetail.setBio(request.getBio());
                }
                if (user.getRole() == User.UserRole.CREATOR && request.getJobId() != null) {
                        Job job = jobRepository.findById(request.getJobId())
                                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직업입니다."));
                        user.setJob(job);
                }
                if (request.getProfileImageUrl() != null) {
                        userDetail.setProfileImageUrl(request.getProfileImageUrl());
                }

                String newPassword = request.getNewPassword();
                if (newPassword != null && !newPassword.isEmpty()) {
                        userDetail.setPassword(passwordEncoder.encode(newPassword));
                }

                userRepository.save(user);
        }

        @Transactional
        public void softDeleteUser(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("해당 사용자를 찾을 수 없습니다. ID: " + userId));

                user.setIsActive(false);
                user.setJob(null);

                UserDetail userDetail = user.getUserDetail();

                if (userDetail != null) {
                        // 길이(10자 이하)와 유일성(unique) 제약 조건을 모두 만족하도록 userId를 추가
                        userDetail.setNickname("탈퇴한 사용자_" + user.getUserId());

                        // @NotBlank를 만족시키기 위한 더미 데이터
                        userDetail.setUsername("탈퇴한 사용자");

                        // @NotBlank, @Email, unique 제약 조건을 모두 만족하도록 userId를 추가
                        userDetail.setEmail("deleted_" + user.getUserId() + "@example.com");
                        userDetail.setBio(null);
                        userDetail.setProfileImageUrl(null);
                        userDetail.setPassword(null);
                        userDetail.setPlatformId(null);
                }

                userRepository.save(user);
        }
}