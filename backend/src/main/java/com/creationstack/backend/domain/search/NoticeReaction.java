package com.creationstack.backend.domain.search;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
class NoticeReactionId implements Serializable { // 셋 다 PK
    private Long notice;
    private Long user;
    private String emoji;
}

@Getter
@Setter
@Builder
@Table(name = "notice_reactions")
@IdClass(NoticeReactionId.class)
@NoArgsConstructor
@AllArgsConstructor
public @Entity class NoticeReaction { // 공지 리액션 테이블

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "notice_id")
    private Notice notice; // 공지

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // 유저

    @Id
    @Column(length = 10)
    private String emoji; // 이모티콘
}
