package com.creationstack.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.creationstack.backend.domain.entity.UserDetail;

import java.util.Optional;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Long> {
    Optional<UserDetail> findByEmail(String email);
    Optional<UserDetail> findByNickname(String nickname);
    boolean existsByEmail(String email);
    boolean existsByNickname(String nickname);
}
