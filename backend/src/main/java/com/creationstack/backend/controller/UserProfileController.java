package com.creationstack.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

import com.creationstack.backend.dto.member.PublicProfileResponse;
import com.creationstack.backend.dto.member.UpdateProfileRequest;
import com.creationstack.backend.dto.member.UserProfileResponse;
import com.creationstack.backend.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getUserProfile(Authentication authentication) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            UserProfileResponse response = userService.getUserProfile(userId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("사용자 프로필 조회 실패: {}", e.getMessage());
            UserProfileResponse response = UserProfileResponse.builder()
                    .success(false)
                    .build();
            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            log.error("프로필 조회 중 예상치 못한 오류 발생", e);
            UserProfileResponse response = UserProfileResponse.builder()
                    .success(false)
                    .build();
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateMyProfile(Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        try {
            Long userId = (Long) authentication.getPrincipal();
            userService.updateUserProfile(userId, request);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            log.error("프로필 수정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("프로필 수정 중 예상치 못한 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/public/{nickname}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(@PathVariable String nickname) {
        PublicProfileResponse response = userService.getPublicProfile(nickname);
        return ResponseEntity.ok(response);
    }
}
