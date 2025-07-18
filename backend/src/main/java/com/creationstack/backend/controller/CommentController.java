package com.creationstack.backend.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creationstack.backend.dto.CommentCreateDto;
import com.creationstack.backend.dto.CommentResponseDto;
import com.creationstack.backend.dto.CommentUpdateDto;
import com.creationstack.backend.service.CommentService;

import lombok.RequiredArgsConstructor;

@Transactional
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contents/{contentId}/comments")
public class CommentController {

	private final CommentService commentService;

	// 댓글 작성
	@PostMapping
	public ResponseEntity<CommentResponseDto> createComment(
	        @PathVariable("contentId") Long contentId,
	        @RequestBody CommentCreateDto dto,
	        Authentication authentication) {
	   
		Long userId = (Long) authentication.getPrincipal();
	    dto.setContentId(contentId);
	    dto.setUserId(userId); 
	    return ResponseEntity.ok(commentService.createComment(dto));
	}

	// 댓글 목록 조회
	@GetMapping
	public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable("contentId") Long contentId) {
		System.out.println("요청 contentId: " + contentId);
		return ResponseEntity.ok(commentService.getCommentsByContentId(contentId));
	}

	// 댓글 수정
	@PutMapping("/{commentId}")
	public ResponseEntity<CommentResponseDto> updateComment(@PathVariable Long contentId, @PathVariable Long commentId,
			@RequestBody CommentUpdateDto dto) {
		return ResponseEntity.ok(commentService.updateComment(commentId, dto));
	}

	// 댓글 삭제
	@DeleteMapping("/{commentId}")
	public ResponseEntity<Void> deleteComment(
	        @PathVariable Long contentId,
	        @PathVariable Long commentId,
	        Authentication authentication) throws AccessDeniedException {

	    Long userId = (Long) authentication.getPrincipal();
	    commentService.deleteComment(commentId, userId);
	    return ResponseEntity.ok().build();
	}
	
	// 댓글 좋아요 
	@PostMapping("/{commentId}/like")
	public ResponseEntity<String> toggleLike(
	        @PathVariable Long contentId,
	        @PathVariable Long commentId,
	        Authentication authentication) {

	    Long userId = (Long) authentication.getPrincipal();
	    boolean isLiked = commentService.toggleLike(commentId, userId);
	    String result = isLiked ? "liked" : "unliked";
	    return ResponseEntity.ok(result);
	}

}
