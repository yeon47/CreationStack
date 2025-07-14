package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@Table(name = "comments")
@NoArgsConstructor
@AllArgsConstructor
public @Entity class Comment { // 댓글 테이블

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId; // 댓글 테이블 기본키

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // 댓글 단 유저

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "content_id", nullable = false)
    private Content content; // 댓글 단 콘텐츠

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment; // 자기참조 대댓글용 부모댓글 식별값

    @Lob
    @Column(nullable = false)
    private String contentText; // 댓글 내용

    @Column(name = "like_count")
    private int likeCount = 0; // 댓글 좋아요 수

    @Column(name = "reply_count")
    private int replyCount = 0; // 댓글 수

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt; // 댓글 단 시간
}
