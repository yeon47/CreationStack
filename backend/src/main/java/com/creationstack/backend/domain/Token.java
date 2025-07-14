package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Getter
@Setter
@Builder
@Table(name = "tokens")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Token { // 토큰 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId; // 토큰 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 토근 발급받은 유저

    @Column(name = "refresh_token", length = 512, nullable = false, unique = true)
    private String refreshToken;
    // Access Token이 만료되었을 때
    // 재로그인 없이 새로운 Access Token을 받기 위해 사용하는 토큰

    @CreationTimestamp
    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt; // 토큰 생성 시점

    @Column(name = "expire_at", nullable = false)
    private LocalDateTime expireAt; // 토큰 만료 시점

}
