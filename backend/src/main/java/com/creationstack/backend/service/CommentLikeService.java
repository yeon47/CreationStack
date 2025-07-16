package com.creationstack.backend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.creationstack.backend.domain.Comment;
import com.creationstack.backend.domain.CommentLike;
import com.creationstack.backend.domain.User;
import com.creationstack.backend.repository.CommentLikeRepository;
import com.creationstack.backend.repository.CommentRepository;
import com.creationstack.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentLikeService {

    private final CommentLikeRepository commentLikeRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public boolean toggleLike(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Optional<CommentLike> existing = commentLikeRepository.findByUserAndComment(user, comment);

        if (existing.isPresent()) {
            CommentLike like = existing.get();
            like.toggle();
            return like.isActive();
        } else {
            CommentLike like = new CommentLike(comment, user);
            commentLikeRepository.save(like);
            return true;
        }
    }
}

