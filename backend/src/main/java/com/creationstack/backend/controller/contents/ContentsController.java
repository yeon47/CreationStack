package com.creationstack.backend.controller.contents;

import com.creationstack.backend.dto.content.ContentDetailResponse;
import com.creationstack.backend.service.ContentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/contents") // <- 명세서에 맞춘 URI
public class ContentsController {

    private final ContentService contentService;

    // 콘텐츠 상세 조회 (예: /api/contests/detail/1)
    @GetMapping("/detail/{contentId}")
    public ContentDetailResponse getContentDetail(@PathVariable Long contentId) {
        log.info("[/api/contents/detail/{}] 요청 수신", contentId);
        return contentService.getContentDetail(contentId);
    }

    // 필요하다면 다른 /api/contents 관련 엔드포인트도 여기에 추가 가능
}
