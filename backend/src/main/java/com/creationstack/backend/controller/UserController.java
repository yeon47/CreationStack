package com.creationstack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.creationstack.backend.dto.member.SignupRequest;
import com.creationstack.backend.dto.member.SignupResponse;
import com.creationstack.backend.service.AuthService;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final AuthService authService;

    @PostMapping
    public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest request,
            BindingResult bindingResult) {

        // 유효성 검사 오류 처리
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.joining(", "));

            SignupResponse response = SignupResponse.builder()
                    .success(false)
                    .message("입력 정보가 올바르지 않습니다: " + errorMessage)
                    .build();

            return ResponseEntity.badRequest().body(response);
        }

        try {
            SignupResponse response = authService.signup(request);

            if (response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (IllegalArgumentException e) {
            log.error("회원가입 실패: {}", e.getMessage());
            SignupResponse response = SignupResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            log.error("회원가입 중 예상치 못한 오류 발생", e);
            SignupResponse response = SignupResponse.builder()
                    .success(false)
                    .message("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}