package com.creationstack.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.creationstack.backend.domain.content.Content;
import com.creationstack.backend.domain.content.Like;
import com.creationstack.backend.domain.user.User;

public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndContent(User user, Content content);

    long countByContent(Content content);

    List<Like> findByUserOrderByCreatedAtDesc(User user); 
    
   // Page<Like> findByUserAndIsActiveTrue(User user, Pageable pageable);
    @Query("SELECT l FROM Like l WHERE l.user.userId = :userId AND l.isActive = true")
    Page<Like> findByUserIdAndIsActiveTrue(@Param("userId") Long userId, Pageable pageable);
}