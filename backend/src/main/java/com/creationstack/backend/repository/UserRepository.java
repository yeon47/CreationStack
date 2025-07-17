package com.creationstack.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.creationstack.backend.domain.user.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u JOIN FETCH u.userDetail ud WHERE ud.email = :email AND u.isActive = true")
    Optional<User> findByEmailAndIsActiveTrue(@Param("email") String email);
    
    @Query("SELECT u FROM User u JOIN FETCH u.userDetail ud WHERE u.userId = :userId AND u.isActive = true")
    Optional<User> findByUserIdAndIsActiveTrue(@Param("userId") Long userId);
    
    boolean existsByUserDetail_Email(String email);
    boolean existsByUserDetail_Nickname(String nickname);
}

