package com.creationstack.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.StringUtils;

import com.creationstack.backend.dto.member.TokenRefreshRequest;
import com.creationstack.backend.dto.member.TokenRefreshResponse;
import com.creationstack.backend.dto.member.LoginRequest;
import com.creationstack.backend.dto.member.LoginResponse;
import com.creationstack.backend.dto.member.LogoutRequest;
import com.creationstack.backend.dto.member.LogoutResponse;
import com.creationstack.backend.service.AuthService;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    // 추가: 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request,
            BindingResult bindingResult) {

        // 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            LoginResponse response = LoginResponse.builder()
                    .success(false)
                    .message("입력 정보가 올바르지 않습니다: " + errorMessage)
                    .build();

            return ResponseEntity.badRequest().body(response);
        }

        try {
            LoginResponse response = authService.login(request);

            if (response.isSuccess()) {
                log.info("로그인 성공: {}", request.getEmail());
                return ResponseEntity.ok(response);
            } else {
                log.warn("로그인 실패: {} - {}", request.getEmail(), response.getMessage());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("로그인 처리 중 예상치 못한 오류 발생", e);
            LoginResponse response = LoginResponse.builder()
                    .success(false)
                    .message("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // 기존 토큰 갱신 메서드는 그대로 유지
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refreshToken(@Valid @RequestBody TokenRefreshRequest request,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            TokenRefreshResponse response = TokenRefreshResponse.builder()
                    .success(false)
                    .message("리프레시 토큰이 필요합니다.")
                    .build();
            return ResponseEntity.badRequest().body(response);
        }

        try {
            TokenRefreshResponse response = authService.refreshToken(request);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생", e);
            TokenRefreshResponse response = TokenRefreshResponse.builder()
                    .success(false)
                    .message("토큰 갱신에 실패했습니다.")
                    .build();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * 로그아웃 - Refresh Token 방식
     * 클라이언트가 refresh token을 body에 포함하여 요청
     */
    @PostMapping("/logout")
    public ResponseEntity<LogoutResponse> logout(@Valid @RequestBody LogoutRequest request,
            BindingResult bindingResult) {

        // 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            LogoutResponse response = LogoutResponse.error("입력 정보가 올바르지 않습니다: " + errorMessage);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            LogoutResponse response = authService.logout(request);

            if (response.isSuccess()) {
                log.info("로그아웃 성공");
                return ResponseEntity.ok(response);
            } else {
                log.warn("로그아웃 실패: {}", response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("로그아웃 처리 중 예상치 못한 오류 발생", e);
            LogoutResponse response = LogoutResponse.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 로그아웃 - Authorization Header 방식
     * 클라이언트가 Authorization 헤더에 Bearer 토큰을 포함하여 요청
     */
    @PostMapping("/logout-token")
    public ResponseEntity<LogoutResponse> logoutWithToken(HttpServletRequest request) {

        try {
            // Authorization 헤더에서 토큰 추출
            String token = extractTokenFromRequest(request);

            if (!StringUtils.hasText(token)) {
                LogoutResponse response = LogoutResponse.error("인증 토큰이 필요합니다.");
                return ResponseEntity.badRequest().body(response);
            }

            LogoutResponse response = authService.logoutWithAccessToken(token);

            if (response.isSuccess()) {
                log.info("토큰 기반 로그아웃 성공");
                return ResponseEntity.ok(response);
            } else {
                log.warn("토큰 기반 로그아웃 실패: {}", response.getMessage());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("토큰 기반 로그아웃 처리 중 예상치 못한 오류 발생", e);
            LogoutResponse response = LogoutResponse.error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 헤더에서 Bearer 토큰 추출
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}