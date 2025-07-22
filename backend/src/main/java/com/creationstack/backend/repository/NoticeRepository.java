package com.creationstack.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.creationstack.backend.domain.notice.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

// 공지 id 찾는 메서드 (삭제하지 말아주세요 주석은 지우셔도 됩니다)
	Optional<Notice> findById(Long noticeId);

}
