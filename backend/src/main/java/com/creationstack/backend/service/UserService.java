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
                // 1. 사용자 정보 조회
                User user = userRepository.findByUserIdAndIsActiveTrue(userId)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                UserDetail userDetail = user.getUserDetail();

                // 2. 현재 비밀번호 입력 여부 및 정확성 검증 (필수)
                String currentPassword = request.getCurrentPassword();
                if (currentPassword == null || currentPassword.isEmpty()) {
                        throw new IllegalArgumentException("프로필을 수정하려면 현재 비밀번호를 입력해야 합니다.");
                }
                if (!passwordEncoder.matches(currentPassword, userDetail.getPassword())) {
                        throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
                }

                // 3. 비밀번호 검증 통과 시, 프로필 정보 업데이트
                // 닉네임 변경
                if (request.getNickname() != null && !request.getNickname().isEmpty()) {
                        userDetail.setNickname(request.getNickname());
                }
                // 소개글 변경
                if (request.getBio() != null) {
                        userDetail.setBio(request.getBio());
                }
                // 직업 변경
                if (user.getRole() == User.UserRole.CREATOR && request.getJobId() != null) {
                        Job job = jobRepository.findById(request.getJobId())
                                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직업입니다."));
                        user.setJob(job);
                }
                // 프로필 이미지 URL 변경
                if (request.getProfileImageUrl() != null) {
                        userDetail.setProfileImageUrl(request.getProfileImageUrl());
                }

                // 4. 새 비밀번호 입력 시, 비밀번호 변경 (선택)
                String newPassword = request.getNewPassword();
                if (newPassword != null && !newPassword.isEmpty()) {
                        userDetail.setPassword(passwordEncoder.encode(newPassword));
                }

                // 5. 변경된 정보 저장
                userRepository.save(user);
        }
}