package com.creationstack.backend.dto;

import com.creationstack.backend.domain.AccessType;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentSearchDto { // 콘텐츠 필터링 조건 Dto

    private String keyword; // 제목 + 내용 + 닉네임 통합 검색
    private List<Long> categories; // 카테고리
    private AccessType accessType; // 유/무료
}
