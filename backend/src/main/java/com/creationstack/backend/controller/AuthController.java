package com.creationstack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.creationstack.backend.dto.TokenRefreshRequest;
import com.creationstack.backend.dto.TokenRefreshResponse;
import com.creationstack.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

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
                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생", e);
            TokenRefreshResponse response = TokenRefreshResponse.builder()
                    .success(false)
                    .message("토큰 갱신에 실패했습니다.")
                    .build();
            return ResponseEntity.status(401).body(response);
        }
    }
}