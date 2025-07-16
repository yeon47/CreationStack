package com.creationstack.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.creationstack.backend.service.CommentLikeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contents/{contentId}/comments")
public class CommentLikeController {
	
	private final CommentLikeService commentLikeService;

    @PostMapping("/{commentId}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable Long contentId,
            @PathVariable Long commentId,
            @RequestParam("userId") Long userId) {

        boolean isLiked = commentLikeService.toggleLike(commentId, userId);
        String result = isLiked ? "liked" : "unliked";
        return ResponseEntity.ok(result);
    }

}
