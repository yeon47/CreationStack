package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@Table(name = "notices")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Notice { // 공지 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_id")
    private Long noticeId; // 공지 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator; // 공지 쓴 크리에이터

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 공지 내용

    @Column(name = "thumbnail_url", length = 512)
    private String thumbnailUrl; // 공지 썸네일 Url

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 공지 작성 시간
}
