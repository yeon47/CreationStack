package com.creationstack.backend.service.notice;

import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.dto.notice.*;

import java.util.List;

public interface NoticeService {

    NoticeResponseDto createNotice(NoticeCreateDto dto, User user); // 공지 등록 (creator만 가능)

    NoticeDetailDto getNotice(Long noticeId, User user); // 단건 조회 (+ 본인 리액션 포함)

    List<NoticeResponseDto> getAllNotices(); // 전체 목록 조회

    NoticeResponseDto updateNotice(Long noticeId, NoticeUpdateDto dto, User user); // 수정 (creator만)

    void deleteNotice(Long noticeId, User user); // 삭제 (creator만)

    void reactToNotice(Long noticeId, User user, String emoji); // 리액션 등록/수정

    List<NoticeReactionDto> getReactions(Long noticeId); // 리액션 목록

}
