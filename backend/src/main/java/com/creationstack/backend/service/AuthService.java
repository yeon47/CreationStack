package com.creationstack.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.creationstack.backend.auth.JwtUtil;
import com.creationstack.backend.domain.entity.Job;
import com.creationstack.backend.domain.entity.RefreshToken;
import com.creationstack.backend.domain.entity.User;
import com.creationstack.backend.domain.entity.UserDetail;
import com.creationstack.backend.domain.entity.User.UserRole;
import com.creationstack.backend.dto.SignupRequest;
import com.creationstack.backend.dto.SignupResponse;
import com.creationstack.backend.dto.TokenRefreshRequest;
import com.creationstack.backend.dto.TokenRefreshResponse;
import com.creationstack.backend.repository.JobRepository;
import com.creationstack.backend.repository.RefreshTokenRepository;
import com.creationstack.backend.repository.UserDetailRepository;
import com.creationstack.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final UserDetailRepository userDetailRepository;
    private final JobRepository jobRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public SignupResponse signup(SignupRequest request) {
        // 이메일 중복 체크
        if (userDetailRepository.existsByEmail(request.getEmail())) {
            return SignupResponse.builder()
                    .success(false)
                    .message("이미 사용 중인 이메일입니다.")
                    .build();
        }

        // 닉네임 중복 체크
        if (userDetailRepository.existsByNickname(request.getNickname())) {
            return SignupResponse.builder()
                    .success(false)
                    .message("이미 사용 중인 닉네임입니다.")
                    .build();
        }

        // 크리에이터인 경우 직업 존재 여부 확인
        Job job = null;
        if (request.getRole() == UserRole.USER.CREATOR) {
            job = jobRepository.findById(request.getJobId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 직업입니다."));
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // User 엔티티 생성
        User user = User.builder()
                .role(request.getRole())
                .job(job)
                .isActive(true)
                .build();

        // UserDetail 엔티티 생성
        UserDetail userDetail = UserDetail.builder()
                .user(user)
                .username(request.getUsername())
                .nickname(request.getNickname())
                .bio(request.getBio())
                .platform(UserDetail.Platform.LOCAL)
                .email(request.getEmail())
                .password(encodedPassword)
                .build();

        user.setUserDetail(userDetail);

        // 데이터베이스 저장
        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(
                savedUser.getUserId(),
                userDetail.getEmail(),
                savedUser.getRole().name(),
                userDetail.getNickname());

        String refreshToken = jwtUtil.generateRefreshToken(savedUser.getUserId());

        // Refresh Token 저장
        saveRefreshToken(savedUser.getUserId(), refreshToken);

        // 응답 생성
        return SignupResponse.builder()
                .success(true)
                .message("회원가입이 완료되었습니다.")
                .data(SignupResponse.UserData.builder()
                        .user(SignupResponse.UserInfo.builder()
                                .userId(savedUser.getUserId())
                                .username(userDetail.getUsername())
                                .nickname(userDetail.getNickname())
                                .email(userDetail.getEmail())
                                .role(savedUser.getRole())
                                .jobId(job != null ? job.getJobId() : null)
                                .jobName(job != null ? job.getName() : null)
                                .bio(userDetail.getBio())
                                .isActive(savedUser.getIsActive())
                                .createdAt(savedUser.getCreatedAt())
                                .build())
                        .tokens(SignupResponse.TokenInfo.builder()
                                .accessToken(accessToken)
                                .refreshToken(refreshToken)
                                .tokenType("Bearer")
                                .expiresIn(jwtUtil.getAccessTokenExpirationInSeconds())
                                .build())
                        .build())
                .redirect("/")
                .build();
    }

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        // Refresh Token 유효성 검증
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            return TokenRefreshResponse.builder()
                    .success(false)
                    .message("유효하지 않은 리프레시 토큰입니다.")
                    .build();
        }

        // 데이터베이스에서 토큰 확인
        Optional<RefreshToken> tokenEntity = refreshTokenRepository
                .findByTokenAndIsRevokedFalse(refreshToken);

        if (tokenEntity.isEmpty() || tokenEntity.get().getExpiresAt().isBefore(LocalDateTime.now())) {
            return TokenRefreshResponse.builder()
                    .success(false)
                    .message("만료되었거나 유효하지 않은 리프레시 토큰입니다.")
                    .build();
        }

        Long userId = jwtUtil.getUserIdFromRefreshToken(refreshToken);

        // 사용자 정보 조회
        User user = userRepository.findByUserIdAndIsActiveTrue(userId)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다."));

        // 새 Access Token 생성
        String newAccessToken = jwtUtil.generateAccessToken(
                user.getUserId(),
                user.getUserDetail().getEmail(),
                user.getRole().name(),
                user.getUserDetail().getNickname());

        return TokenRefreshResponse.builder()
                .success(true)
                .data(TokenRefreshResponse.TokenData.builder()
                        .accessToken(newAccessToken)
                        .tokenType("Bearer")
                        .expiresIn(jwtUtil.getAccessTokenExpirationInSeconds())
                        .build())
                .build();
    }

    private void saveRefreshToken(Long userId, String token) {
        // 기존 토큰들 무효화
        refreshTokenRepository.revokeAllByUserId(userId);

        // 새 토큰 저장
        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(token)
                .userId(userId)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtUtil.getRefreshTokenExpirationInSeconds()))
                .createdAt(LocalDateTime.now())
                .isRevoked(false)
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
    }
}
