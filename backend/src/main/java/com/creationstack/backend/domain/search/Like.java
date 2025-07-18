package com.creationstack.backend.domain.search;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "likes",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_content", columnNames = {"user_id", "content_id"}),
        indexes = @Index(name = "idx_content_user", columnList = "user_id, is_active, created_at"))
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Like { // 좋아요 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId; // 좋아요 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 좋아요 누른 유저

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content; // 좋아요 누른 콘텐츠

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; // 좋아요 누른 시간

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // 좋아요 여부
}
