package com.creationstack.backend.service;

import com.creationstack.backend.domain.content.AccessType;
import com.creationstack.backend.domain.content.Attachment;
import com.creationstack.backend.domain.content.Content;
import com.creationstack.backend.domain.content.ContentCategory;
import com.creationstack.backend.domain.content.ContentCategoryMapping;
import com.creationstack.backend.domain.user.User;
import com.creationstack.backend.dto.content.ContentCreateRequest;
import com.creationstack.backend.dto.content.ContentResponse;
import com.creationstack.backend.dto.content.ContentUpdateRequest;
import com.creationstack.backend.exception.CustomException; // CustomException 임포트
import com.creationstack.backend.repository.content.AttachmentRepository;
import com.creationstack.backend.repository.content.ContentCategoryRepository;
import com.creationstack.backend.repository.content.ContentRepository;
import com.creationstack.backend.repository.UserRepository;
import com.creationstack.backend.service.FileStorageService; // FileStorageService 임포트
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus; // HttpStatus 임포트
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 콘텐츠 관련 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * 콘텐츠 생성, 조회, 수정, 삭제 기능을 제공합니다.
 */
@Slf4j // 로깅을 위한 Lombok 어노테이션
@RequiredArgsConstructor // final 필드에 대한 생성자를 자동으로 생성하여 의존성 주입
@Service // Spring 서비스 컴포넌트임을 나타냄
@Transactional(readOnly = true) // 기본적으로 읽기 전용 트랜잭션 적용
public class ContentService {

    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final ContentCategoryRepository contentCategoryRepository;
    private final AttachmentRepository attachmentRepository;
    private final FileStorageService fileStorageService; // S3 연동을 위한 FileStorageService 주입

    /**
     * 새로운 콘텐츠를 생성합니다.
     * 썸네일 및 첨부파일을 S3에 업로드합니다.
     *
     * @param request ContentCreateRequest DTO
     * @param creatorId 콘텐츠를 생성하는 사용자의 ID
     * @return 생성된 콘텐츠의 응답 DTO
     */
    @Transactional // 쓰기 작업이므로 트랜잭션 적용
    public ContentResponse createContent(ContentCreateRequest request, Long creatorId) {
        // 1. 크리에이터(User) 조회
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "크리에이터를 찾을 수 없습니다. ID: " + creatorId));

        // 2. 썸네일 이미지 처리
        String thumbnailUrl = null;
        if (request.getThumbnailFile() != null && !request.getThumbnailFile().isEmpty()) {
            try {
                thumbnailUrl = fileStorageService.uploadFile(request.getThumbnailFile(), "thumbnails");
            } catch (IOException e) {
                log.error("썸네일 업로드 실패", e);
                throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "썸네일 업로드에 실패했습니다.", e);
            }
        }

        // 3. Content 엔티티 생성
        Content content = Content.builder()
                .creator(creator)
                .title(request.getTitle())
                .content(request.getContent())
                .thumbnailUrl(thumbnailUrl) // 실제 S3 URL 사용
                .accessType(request.getAccessType())
                .viewCount(0)
                .likeCount(0)
                .commentCount(0)
                .build();

        // 4. 카테고리 매핑 처리
        Set<ContentCategory> categories = request.getCategoryNames().stream()
                .map(categoryName -> contentCategoryRepository.findByName(categoryName)
                        .orElseGet(() -> { // 존재하지 않는 카테고리인 경우 새로 생성 (운영에서는 미리 정의된 카테고리만 허용할 수 있음)
                            log.warn("존재하지 않는 카테고리입니다. 새로 생성: {}", categoryName);
                            return contentCategoryRepository.save(ContentCategory.builder().name(categoryName).build());
                        }))
                .collect(Collectors.toSet());

        categories.forEach(category ->
            content.getCategoryMappings().add(ContentCategoryMapping.builder()
                .content(content)
                .category(category)
                .build())
        );

        // 5. Content 저장
        Content savedContent = contentRepository.save(content);

        // 6. 첨부파일 처리
        if (request.getAttachmentFiles() != null && !request.getAttachmentFiles().isEmpty()) {
            List<Attachment> attachments = request.getAttachmentFiles().stream()
                    .map(file -> {
                        String fileUrl = null;
                        String storedFileName = UUID.randomUUID().toString(); // S3에 저장될 고유 파일명
                        try {
                            fileUrl = fileStorageService.uploadFile(file, "attachments");
                            // S3 URL에서 실제 저장된 파일명 (UUID) 추출. UUID는 이미 파일명에 포함되어 있음.
                            // 여기서는 S3에 저장된 파일의 고유한 이름 (UUID-originalFileName)을 storedFileName으로 사용.
                            storedFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                        } catch (IOException e) {
                            log.error("첨부파일 업로드 실패: {}",((MultipartFile) file).getOriginalFilename(), e);
                            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "첨부파일 업로드에 실패했습니다.", e);
                        }

                        return Attachment.builder()
                                .content(savedContent)
                                .fileUrl(fileUrl) // 실제 S3 URL 사용
                                .originalFileName(file.getOriginalFilename())
                                .storedFileName(storedFileName) // 실제 S3에 저장된 파일명 (UUID 포함)
                                .fileType(file.getContentType())
                                .fileSize(file.getSize())
                                .build();
                    })
                    .collect(Collectors.toList());
            attachmentRepository.saveAll(attachments);
            // Content 엔티티에 첨부파일 목록 설정 (ContentResponse 생성을 위해)
            savedContent.setAttachments(new HashSet<>(attachments)); // Set으로 변환하여 할당
        } else {
            savedContent.setAttachments(Collections.emptySet());
        }

        log.info("콘텐츠 생성 완료: {}", savedContent.getContentId());
        return ContentResponse.from(savedContent);
    }

    /**
     * 특정 ID의 콘텐츠를 조회하고 조회수를 1 증가시킵니다.
     *
     * @param contentId 조회할 콘텐츠의 ID
     * @return 조회된 콘텐츠의 응답 DTO
     */
    @Transactional // 조회수 증가로 인해 쓰기 트랜잭션 필요
    public ContentResponse getContentById(Long contentId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "콘텐츠를 찾을 수 없습니다. ID: " + contentId));

        content.incrementViewCount(); // 조회수 증가
        // contentRepository.save(content); // @Transactional 어노테이션이 있으면 변경 감지(Dirty Checking)로 자동 저장됨

        log.info("콘텐츠 조회 및 조회수 증가: Content ID = {}", contentId);
        return ContentResponse.from(content);
    }

    /**
     * 특정 크리에이터가 작성한 모든 콘텐츠 목록을 조회합니다.
     *
     * @param creatorId 크리에이터의 ID
     * @return 해당 크리에이터의 콘텐츠 목록 응답 DTO
     */
    public List<ContentResponse> getContentsByCreator(Long creatorId) {
        // 크리에이터 존재 여부 확인 (선택 사항: 콘텐츠가 없으면 빈 리스트 반환)
        if (!userRepository.existsById(creatorId)) { // existsById 사용
            throw new CustomException(HttpStatus.NOT_FOUND, "크리에이터를 찾을 수 없습니다. ID: " + creatorId);
        }

        List<Content> contents = contentRepository.findByCreator_UserId(creatorId);
        log.info("크리에이터 ID {} 의 콘텐츠 {}개 조회", creatorId, contents.size());
        return contents.stream()
                .map(ContentResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * 콘텐츠를 수정합니다.
     * 썸네일 및 첨부파일 변경 로직을 S3와 연동합니다.
     *
     * @param contentId 수정할 콘텐츠의 ID
     * @param request ContentUpdateRequest DTO
     * @param creatorId 수정 요청을 하는 사용자의 ID (권한 확인용)
     * @return 수정된 콘텐츠의 응답 DTO
     */
    @Transactional // 쓰기 작업이므로 트랜잭션 적용
    public ContentResponse updateContent(Long contentId, ContentUpdateRequest request, Long creatorId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "콘텐츠를 찾을 수 없습니다. ID: " + contentId));

        // 1. 권한 확인: 콘텐츠 작성자와 수정 요청자가 동일한지 확인
        if (!content.getCreator().getUserId().equals(creatorId)) {
            throw new CustomException(HttpStatus.FORBIDDEN, "콘텐츠를 수정할 권한이 없습니다.");
        }

        // 2. 썸네일 이미지 처리
        String newThumbnailUrl = content.getThumbnailUrl(); // 기본적으로 기존 URL 유지
        if (request.getNewThumbnailFile() != null && !request.getNewThumbnailFile().isEmpty()) {
            // 기존 썸네일 삭제 (새 파일이 업로드될 경우)
            if (newThumbnailUrl != null) {
                fileStorageService.deleteFile(newThumbnailUrl);
            }
            // 새로운 썸네일 업로드
            try {
                newThumbnailUrl = fileStorageService.uploadFile(request.getNewThumbnailFile(), "thumbnails");
            } catch (IOException e) {
                log.error("새 썸네일 업로드 실패", e);
                throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "새 썸네일 업로드에 실패했습니다.", e);
            }
        } else if (request.getExistingThumbnailUrl() != null && !request.getExistingThumbnailUrl().isEmpty()) {
            newThumbnailUrl = request.getExistingThumbnailUrl(); // 기존 썸네일 유지
        } else {
            // 썸네일 제거 요청 (기존 썸네일이 있었고 새로운 파일이 없으며 기존 URL도 제공되지 않았을 때)
            if (newThumbnailUrl != null) {
                fileStorageService.deleteFile(newThumbnailUrl);
            }
            newThumbnailUrl = null;
        }


        // 3. 카테고리 매핑 처리
        Set<ContentCategory> updatedCategories = request.getCategoryNames().stream()
                .map(categoryName -> contentCategoryRepository.findByName(categoryName)
                        .orElseGet(() -> {
                            log.warn("존재하지 않는 카테고리입니다. 새로 생성: {}", categoryName);
                            return contentCategoryRepository.save(ContentCategory.builder().name(categoryName).build());
                        }))
                .collect(Collectors.toSet());

        // 4. Content 엔티티 업데이트
        content.update(request.getTitle(), request.getContent(), newThumbnailUrl, request.getAccessType(), updatedCategories);

        // 5. 첨부파일 처리
        // 기존 첨부파일 중 유지할 파일 ID 목록을 기반으로 삭제할 파일 식별
        Set<Attachment> existingAttachments = content.getAttachments(); // Content 엔티티에서 현재 첨부파일 가져옴
        Set<Long> existingAttachmentIdsToKeep = request.getExistingAttachmentIds() != null ?
                request.getExistingAttachmentIds().stream().collect(Collectors.toSet()) : Collections.emptySet();

        // 삭제할 첨부파일 식별 및 S3/DB에서 제거
        existingAttachments.stream()
                .filter(att -> !existingAttachmentIdsToKeep.contains(att.getAttachmentId()))
                .forEach(att -> {
                    fileStorageService.deleteFile(att.getFileUrl()); // S3에서 파일 삭제
                    attachmentRepository.delete(att); // DB에서 첨부파일 삭제
                });

        // 새로 추가될 첨부파일 저장
        if (request.getNewAttachmentFiles() != null && !request.getNewAttachmentFiles().isEmpty()) {
            List<Attachment> newAttachments = request.getNewAttachmentFiles().stream()
                    .map(file -> {
                        String fileUrl = null;
                        String storedFileName = UUID.randomUUID().toString();
                        try {
                            fileUrl = fileStorageService.uploadFile(file, "attachments");
                            storedFileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
                        } catch (IOException e) {
                            log.error("새 첨부파일 업로드 실패: {}", file.getOriginalFilename(), e);
                            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "새 첨부파일 업로드에 실패했습니다.", e);
                        }
                        return Attachment.builder()
                                .content(content)
                                .fileUrl(fileUrl)
                                .originalFileName(file.getOriginalFilename())
                                .storedFileName(storedFileName)
                                .fileType(file.getContentType())
                                .fileSize(file.getSize())
                                .build();
                    })
                    .collect(Collectors.toList());
            attachmentRepository.saveAll(newAttachments);
            // Content 엔티티에 첨부파일 목록 다시 설정
            content.getAttachments().addAll(newAttachments); // 기존 목록에 새 파일 추가
        }

        // 변경 감지(Dirty Checking)에 의해 content가 자동 저장됨
        log.info("콘텐츠 수정 완료: {}", contentId);
        return ContentResponse.from(content);
    }

    /**
     * 특정 ID의 콘텐츠를 삭제합니다.
     * 관련 첨부파일 및 카테고리 매핑도 함께 삭제됩니다.
     *
     * @param contentId 삭제할 콘텐츠의 ID
     * @param creatorId 삭제 요청을 하는 사용자의 ID (권한 확인용)
     */
    @Transactional // 쓰기 작업이므로 트랜잭션 적용
    public void deleteContent(Long contentId, Long creatorId) {
        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "콘텐츠를 찾을 수 없습니다. ID: " + contentId));

        // 1. 권한 확인: 콘텐츠 작성자와 삭제 요청자가 동일한지 확인
        if (!content.getCreator().getUserId().equals(creatorId)) {
            throw new CustomException(HttpStatus.FORBIDDEN, "콘텐츠를 삭제할 권한이 없습니다.");
        }

        // 2. 관련 첨부파일 S3 및 DB에서 삭제
        Set<Attachment> attachments = content.getAttachments(); // Content 엔티티에서 현재 첨부파일 가져옴
        attachments.forEach(att -> fileStorageService.deleteFile(att.getFileUrl())); // S3에서 파일 삭제
        attachmentRepository.deleteAll(attachments); // DB에서 첨부파일 삭제 (Content의 cascade 설정으로 자동 삭제될 수도 있지만 명시적으로 처리)

        // 3. 콘텐츠 삭제 (ContentCategoryMapping은 Content 엔티티의 cascade 설정으로 자동 삭제됨)
        contentRepository.delete(content);
        log.info("콘텐츠 삭제 완료: {}", contentId);
    }

    /**
     * 초기 카테고리를 설정하는 메서드 (개발/테스트용)
     * @param categoryNames 초기화할 카테고리 이름 목록
     */
    @Transactional
    public void initializeCategories(Set<String> categoryNames) {
        categoryNames.forEach(name -> {
            if (contentCategoryRepository.findByName(name).isEmpty()) {
                contentCategoryRepository.save(ContentCategory.builder().name(name).build());
                log.info("카테고리 초기화: {}", name);
            }
        });
    }
}
