package com.creationstack.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.creationstack.backend.domain.Comment;
import com.creationstack.backend.domain.Content;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

	List<Comment> findByContent(Content content);
	
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Transactional
	@Query("UPDATE Comment c SET c.isDeleted = true WHERE c.commentId = :commentId")
	void markAsDeleted(@Param("commentId") Long commentId);

}
