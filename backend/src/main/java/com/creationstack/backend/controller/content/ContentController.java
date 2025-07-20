package com.creationstack.backend.controller.content; // 실제 프로젝트 패키지 경로로 변경

import com.creationstack.backend.dto.content.ContentCreateRequest;
import com.creationstack.backend.dto.content.ContentList;
import com.creationstack.backend.dto.content.ContentResponse;
import com.creationstack.backend.dto.content.ContentUpdateRequest;
import com.creationstack.backend.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
// import org.springframework.security.core.annotation.AuthenticationPrincipal; // @AuthenticationPrincipal 임포트 제거 (임시)
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/content")
public class ContentController {

    private final ContentService contentService;

    // 콘텐츠 생성 요청
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // 파일 업로드를 위해 multipart/form-data 소비
    public ResponseEntity<ContentResponse> createContent(
            @Valid @ModelAttribute ContentCreateRequest request, // @ModelAttribute로 폼 데이터 바인딩
            @RequestParam("creatorId") Long creatorId // 임시: 테스트를 위해 creatorId를 요청 파라미터로 받음
    ) {
        log.info("콘텐츠 생성 요청 수신: 제목={}, 크리에이터 ID={}", request.getTitle(), creatorId);
        ContentResponse response = contentService.createContent(request, creatorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //특정 콘텐츠 조회
    @GetMapping("/{contentId}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable Long contentId) {
        log.info("콘텐츠 조회 요청 수신: Content ID={}", contentId);
        ContentResponse response = contentService.getContentById(contentId);
        return ResponseEntity.ok(response);
    }

    // 특정 크리에이터의 콘텐츠 목록 조회
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<ContentResponse>> getContentsByCreator(@PathVariable Long creatorId) {
        log.info("크리에이터 ID {} 의 콘텐츠 목록 조회 요청 수신", creatorId);
        List<ContentResponse> responses = contentService.getContentsByCreator(creatorId);
        return ResponseEntity.ok(responses);
    }

    // 특정 콘텐츠 수정
    @PutMapping(value = "/{contentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // 파일 업로드를 위해 multipart/form-data 소비
    public ResponseEntity<ContentResponse> updateContent(
            @PathVariable Long contentId,
            @Valid @ModelAttribute ContentUpdateRequest request, // @ModelAttribute로 폼 데이터 바인딩
            @RequestParam("creatorId") Long creatorId // 임시: 테스트를 위해 creatorId를 요청 파라미터로 받음
    ) {
        log.info("콘텐츠 수정 요청 수신: Content ID={}, 크리에이터 ID={}", contentId, creatorId);
        ContentResponse response = contentService.updateContent(contentId, request, creatorId);
        return ResponseEntity.ok(response);
    }

   // 특정 콘텐츠 삭제
    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> deleteContent(
            @PathVariable Long contentId,
            @RequestParam("creatorId") Long creatorId // 임시: 테스트를 위해 creatorId를 요청 파라미터로 받음
    ) {
        log.info("콘텐츠 삭제 요청 수신: Content ID={}, 크리에이터 ID={}", contentId, creatorId);
        contentService.deleteContent(contentId, creatorId);
        return ResponseEntity.noContent().build(); // 204 No Content 반환
    }
    
    // 콘텐츠 좋아요
 // 좋아요 토글
    @PostMapping("/{contentId}/like")
    public ResponseEntity<String> toggleContentLike(
            @PathVariable Long contentId,
            @RequestParam("userId") Long userId  // ← requestParam으로 받음
    ) {
        boolean isLiked = contentService.toggleLike(contentId, userId);
        return ResponseEntity.ok(isLiked ? "liked" : "unliked");
    }

    
    // 좋아요 콘텐츠 목록 조회-페이징
    @GetMapping("/liked")
    public ResponseEntity<?> getLikedContents(
            @RequestParam("userId") Long userId,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ContentList> likedContents = contentService.getLikedContents(userId, pageable);
        return ResponseEntity.ok(likedContents);
    }

    


//    @PostMapping("/categories/initialize")
//    public ResponseEntity<String> initializeCategories(@RequestBody Set<String> categoryNames) {
//        log.info("카테고리 초기화 요청 수신: {}", categoryNames);
//        contentService.initializeCategories(categoryNames);
//        return ResponseEntity.ok("카테고리 초기화가 완료되었습니다.");
//    }
}
