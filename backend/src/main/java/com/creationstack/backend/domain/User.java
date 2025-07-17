package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class User { // 유저 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId; // 유저 테이블 기본키

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // USER, CREATOR 둘 중 하나

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job; // 유저 직업

    @Column(name = "subscriber_count", nullable = false)
    private int subscriberCount = 0; // 구독자 수

    @Column(name = "is_active")
    private boolean isActive = true; // 활동 여부

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; // 생성 시점에 자동 입력

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 업데이트 시점마다 자동 갱신

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserDetail userDetail; // 유저디테일 매핑

}
