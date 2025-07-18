package com.creationstack.backend.controller.content; // 실제 프로젝트 패키지 경로로 변경

import com.creationstack.backend.dto.content.ContentCreateRequest;
import com.creationstack.backend.dto.content.ContentResponse;
import com.creationstack.backend.dto.content.ContentUpdateRequest;
import com.creationstack.backend.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.annotation.AuthenticationPrincipal; // @AuthenticationPrincipal 임포트 제거 (임시)
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

/**
 * 콘텐츠 관련 REST API 요청을 처리하는 컨트롤러 클래스입니다.
 * 콘텐츠 생성, 조회, 수정, 삭제 엔드포인트를 제공합니다.
 */
@Slf4j // 로깅을 위한 Lombok 어노테이션
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성하여 의존성 주입
@RestController // RESTful 웹 서비스 컨트롤러임을 나타냄
@RequestMapping("/api/content") // 기본 URL 경로 설정 (단수형으로 통일)
public class ContentController {

    private final ContentService contentService;

    /**
     * 새로운 콘텐츠를 생성합니다.
     * multipart/form-data 형식으로 파일과 JSON 데이터를 함께 받습니다.
     *
     * @param request ContentCreateRequest DTO (제목, 내용, 썸네일, 접근 타입, 카테고리, 첨부파일 포함)
     * @param creatorId 콘텐츠를 생성하는 크리에이터의 ID (임시: 테스트를 위해 @RequestParam으로 받음)
     * @return 생성된 콘텐츠의 응답 DTO와 HTTP 201 Created 상태
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) // 파일 업로드를 위해 multipart/form-data 소비
    public ResponseEntity<ContentResponse> createContent(
            @Valid @ModelAttribute ContentCreateRequest request, // @ModelAttribute로 폼 데이터 바인딩
            @RequestParam("creatorId") Long creatorId // 임시: 테스트를 위해 creatorId를 요청 파라미터로 받음
    ) {
        log.info("콘텐츠 생성 요청 수신: 제목={}, 크리에이터 ID={}", request.getTitle(), creatorId);
        ContentResponse response = contentService.createContent(request, creatorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 특정 ID의 콘텐츠를 조회합니다.
     *
     * @param contentId 조회할 콘텐츠의 ID
     * @return 조회된 콘텐츠의 응답 DTO와 HTTP 200 OK 상태
     */
    @GetMapping("/{contentId}")
    public ResponseEntity<ContentResponse> getContentById(@PathVariable Long contentId) {
        log.info("콘텐츠 조회 요청 수신: Content ID={}", contentId);
        ContentResponse response = contentService.getContentById(contentId);
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 크리에이터가 작성한 모든 콘텐츠 목록을 조회합니다.
     *
     * @param creatorId 크리에이터의 ID
     * @return 해당 크리에이터의 콘텐츠 목록 응답 DTO와 HTTP 200 OK 상태
     */
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<ContentResponse>> getContentsByCreator(@PathVariable Long creatorId) {
        log.info("크리에이터 ID {} 의 콘텐츠 목록 조회 요청 수신", creatorId);
        List<ContentResponse> responses = contentService.getContentsByCreator(creatorId);
        return ResponseEntity.ok(responses);
    }

    /**
     * 특정 ID의 콘텐츠를 수정합니다.
     * multipart/form-data 형식으로 파일과 JSON 데이터를 함께 받습니다.
     *
     * @param contentId 수정할 콘텐츠의 ID
     * @param request ContentUpdateRequest DTO (업데이트할 필드 포함)
     * @param creatorId 수정 요청을 하는 사용자의 ID (임시: 테스트를 위해 @RequestParam으로 받음)
     * @return 수정된 콘텐츠의 응답 DTO와 HTTP 200 OK 상태
     */
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

    /**
     * 특정 ID의 콘텐츠를 삭제합니다.
     *
     * @param contentId 삭제할 콘텐츠의 ID
     * @param creatorId 삭제 요청을 하는 사용자의 ID (임시: 테스트를 위해 @RequestParam으로 받음)
     * @return HTTP 204 No Content 상태 (성공적인 삭제)
     */
    @DeleteMapping("/{contentId}")
    public ResponseEntity<Void> deleteContent(
            @PathVariable Long contentId,
            @RequestParam("creatorId") Long creatorId // 임시: 테스트를 위해 creatorId를 요청 파라미터로 받음
    ) {
        log.info("콘텐츠 삭제 요청 수신: Content ID={}, 크리에이터 ID={}", contentId, creatorId);
        contentService.deleteContent(contentId, creatorId);
        return ResponseEntity.noContent().build(); // 204 No Content 반환
    }

    /**
     * 초기 카테고리를 설정하는 엔드포인트 (개발/테스트용).
     * 애플리케이션 시작 시 미리 카테고리를 생성해두는 용도로 사용될 수 있습니다.
     *
     * @param categoryNames 초기화할 카테고리 이름 목록
     * @return HTTP 200 OK 상태
     */
    @PostMapping("/categories/initialize")
    public ResponseEntity<String> initializeCategories(@RequestBody Set<String> categoryNames) {
        log.info("카테고리 초기화 요청 수신: {}", categoryNames);
        contentService.initializeCategories(categoryNames);
        return ResponseEntity.ok("카테고리 초기화가 완료되었습니다.");
    }
}
