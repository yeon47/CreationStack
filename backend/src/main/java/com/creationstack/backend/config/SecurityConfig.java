package com.creationstack.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.creationstack.backend.auth.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        log.info("=== SecurityConfig 설정 시작 ===");

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    log.info("URL 권한 설정 중...");
                    auth
                            // 인증 없이 접근 가능한 경로들
                            .requestMatchers(
                                    "/api/users", // 회원가입
                                    "/api/jobs", // 직업 목록
                                    "/api/users/check-email", // 이메일 중복 확인
                                    "/api/users/check-nickname", // 닉네임 중복 확인
                                    "/api/auth/login", // 로그인
                                    "/api/auth/refresh", // 토큰 갱신
                                    "/api/auth/logout", // 로그아웃 (refresh token 방식)
                                    "/api/auth/kakao/callback", // 카카오 로그인 콜백 경로
                                    "/api/auth/kakao/user-info", // 카카오 정보 가져오는 경로
                                    "/api/content/**", // 모든 /api/content 경로 허용
                                    "/api/upload/image", // 이미지 업로드 경로 허용
                                    "/api/billings/**",
                                    "/api/payments/**",

                                    "/api/contents/*/comments",
                                    "/api/contents/*/comments/*/like",
                                "api/subscriptions/**")

                            .permitAll()
                            // /api/user/** 경로는 인증 필요 (기존 설정 유지)
                            .requestMatchers("/api/user/**").authenticated()

                            // 그 외 모든 요청은 인증 필요 (기존 anyRequest().authenticated() 유지)
                            .anyRequest().authenticated();

                })
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        log.info("=== SecurityConfig 설정 완료 ===");
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
