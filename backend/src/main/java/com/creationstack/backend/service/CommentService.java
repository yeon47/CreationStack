package com.creationstack.backend.service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.creationstack.backend.domain.comment.Comment;
import com.creationstack.backend.domain.comment.Content;
import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.dto.CommentCreateDto;
import com.creationstack.backend.dto.CommentResponseDto;
import com.creationstack.backend.dto.CommentUpdateDto;
import com.creationstack.backend.repository.CommentRepository;
import com.creationstack.backend.repository.ContentRepository;
import com.creationstack.backend.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	
	private final CommentRepository commentRepository;
	private final ContentRepository contentRepository;
	private final UserRepository userRepository;
	
	// 댓글 등록
	public CommentResponseDto createComment(CommentCreateDto dto){
		User user = userRepository.findByUserIdAndIsActiveTrue(dto.getUserId())
		        .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

	        Content content = contentRepository.findById(dto.getContentId())
	                .orElseThrow(() -> new IllegalArgumentException("콘텐츠 없음"));

	        Comment comment = new Comment();
	        comment.setUser(user);
	        comment.setContent(content);
	        comment.setContentText(dto.getContentText());

	        if (dto.getParentCommentId() != null) {
	            Comment parent = commentRepository.findById(dto.getParentCommentId())
	                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글 없음"));
	            comment.setParentComment(parent);
	        }

	        Comment saved = commentRepository.save(comment);
	        return toDto(saved);
	}
	
	// 댓글 등록
	 public List<CommentResponseDto> getCommentsByContentId(Long contentId) {
	        Content content = contentRepository.findById(contentId)
	                .orElseThrow(() -> new IllegalArgumentException("콘텐츠 없음"));

	        List<Comment> comments = commentRepository.findByContent(content);

	        return comments.stream()
	                .map(this::toDto)
	                .collect(Collectors.toList());
	    }
	 
	 // 댓글 수정
	  public CommentResponseDto updateComment(Long commentId, CommentUpdateDto dto) {
	        Comment comment = commentRepository.findById(commentId)
	                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));

	        comment.setContentText(dto.getContentText());
	        return toDto(commentRepository.save(comment));
	    }

	  // 댓글 삭제
	  @Transactional
	  public void deleteComment(Long commentId, Long userId) throws AccessDeniedException {

		    commentRepository.markAsDeleted(commentId);

		  /*  Comment comment = commentRepository.findById(commentId)
	                .orElseThrow(() -> new IllegalArgumentException("댓글 없음"));

	        if (!comment.getUser().getUserId().equals(userId)) {
	            throw new AccessDeniedException("삭제 권한 없음");
	        }

	        comment.setDeleted(true);
	        commentRepository.save(comment);*/
	    }
	  
	  // 응답용 dto 반환
	  private CommentResponseDto toDto(Comment comment) {
	        CommentResponseDto dto = new CommentResponseDto();
	        dto.setCommentId(comment.getCommentId());
	        dto.setUserId(comment.getUser().getUserId());
	        if (comment.getUser().getUserDetail() != null) {
	            dto.setNickname(comment.getUser().getUserDetail().getNickname());
	        }
	        if (comment.getUser().getJob() != null) {
	            dto.setJob(comment.getUser().getJob().getName());
	        }
	        dto.setContentId(comment.getContent().getContentId());
	        dto.setParentCommentId(
	                comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null);
	        dto.setContentText(comment.isDeleted() ? "삭제된 댓글입니다" : comment.getContentText());
	        dto.setCreatedAt(comment.getCreatedAt());
	        return dto;
	    }

}
