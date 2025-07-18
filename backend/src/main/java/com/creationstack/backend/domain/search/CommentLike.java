package com.creationstack.backend.domain.search;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
class CommentLikeId implements Serializable { // 복합키 ID 클래스
    @Column(name = "comment_id")
    private Long comment; // 댓글

    @Column(name = "user_id")
    private Long user; // 유저
}

@Getter
@Setter
@Builder
@Table(name = "comment_likes",
        uniqueConstraints = @UniqueConstraint(name = "uq_user_comment", columnNames = {"user_id", "comment_id"}))
@IdClass(CommentLikeId.class)
@NoArgsConstructor
@AllArgsConstructor
public @Entity class CommentLike { // 댓글-유저 중간테이블

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comment_id")
    private Comment comment; // 댓글 테이블

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 유저 테이블

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true; // 좋아요 여부
}

