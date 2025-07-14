package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Table(name = "user_detail")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class UserDetail { // 유저 개인정보 테이블

    @Id
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // userId가 PK 이면서 FK, 두 테이블에 같은 user_id값 저장
    @JoinColumn(name = "user_id")
    private User user; // user.getUserId()로만 접근 가능

    @Column(length = 50, nullable = false)
    private String username; // 유저 실명

    @Column(name = "platform_id", length = 255)
    private String platformId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform; // LOCAL, KAKAO 둘 중 하나

    @Column(length = 100, nullable = false, unique = true)
    private String email; // 이메일

    @Column(length = 512)
    private String password; // 비밀번호
}
