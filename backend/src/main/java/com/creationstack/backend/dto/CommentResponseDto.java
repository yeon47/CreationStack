package com.creationstack.backend.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseDto {
	private Long commentId;
	private Long userId;
	private String username;
	private Long contentId;
	private Long parentCommentId;
	private String contentText;
	private LocalDateTime createdAt;
	private boolean isLiked;
	private int likeCount;

}
