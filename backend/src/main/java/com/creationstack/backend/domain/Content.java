package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@Table(name = "contents")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Content { // 콘텐츠 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id")
    private Long contentId; // 콘텐츠 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator; // 유저테이블 정보를 콘텐츠 테이블로 가져옴

    @Column(length = 255, nullable = false)
    private String title; // 콘텐츠 제목

    @Lob
    @Column(nullable = false)
    private String content; // TEXT 타입 콘텐츠 내용

    @Column(name = "thumbnail_url", length = 512, nullable = false)
    private String thumbnailUrl; // 썸네일 사진 Url

    @Column(name = "view_count", nullable = false)
    private int viewCount = 0; // 조회수 기본값 0

    @Column(name = "like_count", nullable = false)
    private int likeCount = 0; // 좋아요수 기본값 0

    @Column(name = "comment_count", nullable = false)
    private int commentCount = 0; // 댓글수 기본값 0

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // 콘텐츠 생성 시각

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt; // 콘텐츠 업데이트 시각

    @Enumerated(EnumType.STRING)
    @Column(name = "access_type", nullable = false)
    private AccessType accessType = AccessType.FREE; // 유/무료 여부, 기본값 무료

    @ManyToMany
    @JoinTable(
            name = "content_categories",
            joinColumns = @JoinColumn(name = "content_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories = new HashSet<>();
    // content_categories 중간 테이블 클래스 없이 처리
}
