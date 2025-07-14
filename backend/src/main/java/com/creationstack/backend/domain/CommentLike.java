package com.creationstack.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
class CommentLikeId implements Serializable { // 복합키 ID 클래스
    private Long comment; // 댓글
    private Long user; // 유저
}

@Getter
@Setter
@Builder
@Table(name = "comment_likes")
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
}

