package com.creationstack.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.creationstack.backend.domain.Content;

@Repository
public interface ContentRepository extends JpaRepository<Content,Long> {

}
