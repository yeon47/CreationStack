package com.creationstack.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creationstack.backend.domain.Comment;
import com.creationstack.backend.domain.CommentLike;
import com.creationstack.backend.domain.User;

public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    Optional<CommentLike> findByUserAndComment(User user, Comment comment);

}
